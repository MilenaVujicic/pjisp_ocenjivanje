import os
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from json import loads
from .models import FileUpload
from zipfile import ZipFile
import base64
from os import remove
import pandas as pd
from django.core.files.base import ContentFile
import re
from os import environ
from django.conf import settings
from log.models import LogEntry
from log.serializers import LogEntrySerializer, TableSerializer
from app_user.models import AppUser


def parse_file_data(file_data, user, file_type):
    file = FileUpload.objects.create()
    format, file_str = file_data.split(';base64,')
    ext = format.split('/')[-1]
    file_name = user + file_type
    file.file = ContentFile(base64.b64decode(file_str), name=file_name)
    file.save()

    file_path = 'files/' + file_name

    return file, file_path


def prepare_df_data(df, exam_type, test):
    dfs = []

    et=""
    if test:
        if exam_type == 1:
            et = "05. T1234"
        elif exam_type == 2:
            et = "06. SOV"
    else:
        if exam_type == 1:
             et = "10. P1"
        elif exam_type == 2:
            et = "11. P2"
        elif exam_type == 3:
            et = "12. ISPIT"

    if test:
        df['04. Ime'] = df['Ime i prezime'].str.split(' ', expand=True)[0]
        df['03. Prezime'] = df['Ime i prezime'].str.split(' ', expand=True)[1]
        df = df.rename(columns={"Broj poena": et, "Broj indeksa":"02. Broj indeksa"})
        df = df.loc[:, df.columns.intersection(['04. Ime', '03. Prezime', et, "02. Broj indeksa"])]

    else:
        df = df.rename(columns={"indeks": "02. Broj indeksa", "ime": "04. Ime", "prezime": "03. Prezime", "poeni": et})
        df = df.drop(columns=['ukupno_poena', 'ip', 'datum'])

    for index, row in df.iterrows():
        section = re.split(r'\d{1,3}-\d{4}', df['02. Broj indeksa'][index])[0]
        no = re.split(r'-\d{4}', df['02. Broj indeksa'][index])[0]
        no = re.split(r'[aA-zZ]{2}', no)[1]
        year = re.split(r'\d{1,3}-', df['02. Broj indeksa'][index])[1]
        index_format = section.upper() + ' ' + no + '/' + year
        df.loc[index, '02. Broj indeksa'] = index_format

    current_year = settings.CURRENT_YEAR

    df_ra = df[df['02. Broj indeksa'].str.contains(fr'(?=RA.*)(?=.*{current_year})', regex=True)]
    df_psi = df[df['02. Broj indeksa'].str.contains(fr'(?=PR.*)(?=.*{current_year})', regex=True)]
    df_old = df[~df['02. Broj indeksa'].str.contains(fr'(?=.*{current_year})', regex=True)]

    dfs.append(df_ra)
    dfs.append(df_psi)
    dfs.append(df_old)

    return dfs


def prepare_sheet_writing(sheet_vals, df):
    sheet_df = pd.DataFrame(sheet_vals, columns=sheet_vals[0])
    sheet_df = sheet_df.iloc[1: , :]
    new_df_outer = pd.merge(sheet_df, df, left_on="02. Broj indeksa", right_on="02. Broj indeksa",
                               how="outer").groupby(
        lambda x: x.split('_')[0], axis=1).last()
    new_df_outer = new_df_outer.where(pd.notnull(new_df_outer), "")

    sheet_body = new_df_outer.columns.tolist()
    vals = new_df_outer.values.tolist()
    vals.insert(0, sheet_body)

    return {'values': vals}


def open_sheet_for_reading(service, range, sheet_id):
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=sheet_id, range=range).execute()
    return result.get('values', [])


def open_sheet_for_writing(service, range, sheet_id, body):
    sheet = service.spreadsheets()
    sheet.values().update(spreadsheetId=sheet_id, range=range,
                          body=body, valueInputOption="RAW").execute()


def add_log(dfs, user_email):
    table_instances = []
    user = AppUser.objects.filter(email=user_email)
    t1234 = -1
    sov = -1
    p1 = -1
    p2 = -1
    exam = -1

    for df in dfs:
        for index, row in df.iterrows():

            if '05. T1234' in df.columns:
                t1234 = int(row['05. T1234'])
            if '06. SOV' in df.columns:
                sov = int(row['06. SOV'])
            if '10. P1' in df.columns:
                p1 = int(row['10. P1'])
            if '11. P2' in df.columns:
                p2 = int(row['11. P2'])
            if '12. Ispit' in df.columns:
                exam = int(row['12. Ispit'])
            table_instances.append(LogEntry(index_number=row['02. Broj indeksa'],
                                            user=user.first(),
                                            last_name=row['03. Prezime'],
                                            first_name=row['04. Ime'],
                                            t1234=t1234,
                                            sov=sov,
                                            p1=p1,
                                            p2=p2,
                                            exam=exam))

    LogEntry.objects.bulk_create(table_instances)


def stats_serializer(dfs):
    t1234 = -1
    sov = -1
    p1 = -1
    p2 = -1
    exam = -1

    table_instances = []
    for df in dfs:
        for index, row in df.iterrows():
            if '05. T1234' in df.columns:
                if row['05. T1234'] is None:
                    t1234 = 0
                else:
                    if row['05. T1234'].isnumeric():
                        t1234 = int(row['05. T1234'])
                    else:
                        t1234 = 0
            if '06. SOV' in df.columns:
                if row['06. SOV'] is None:
                    sov = 0
                else:
                    if row['06. SOV'].isnumeric():
                        sov = int(row['06. SOV'])
                    else:
                        sov = 0

            if '10. P1' in df.columns:
                if row['10. P1'] is None:
                    p1 = 0
                else:
                    if row['10. P1'].isnumeric():
                        p1 = int(row['10. P1'])
                    else:
                        p1 = 0

            if '11. P2' in df.columns:
                if row['11. P2'] is None:
                    p2 = 0
                else:
                    if row['11. P2'].isnumeric():
                        p2 = int(row['11. P2'])
                    else:
                        p2 = 0

            if '12. Ispit' in df.columns:
                if row['12. Ispit'] is None:
                    exam = 0
                else:
                    if row['12. Ispit'].isnumeric():
                        exam = int(row['12. Ispit'])
                    else:
                        exam = 0
            table_instances.append(LogEntry(index_number=row['02. Broj indeksa'],
                                            last_name=row['03. Prezime'],
                                            first_name=row['04. Ime'],
                                            t1234=t1234,
                                            sov=sov,
                                            p1=p1,
                                            p2=p2,
                                            exam=exam))

    return table_instances

@csrf_exempt
def test_results(request):
    if request.method == "POST":
        if request.method == "POST":
            body = request.body.decode('utf-8')
            body = loads(body)
            user = body[1]['email'].split('@')
            file, file_path = parse_file_data(body[0]['file'], user[0], '.csv')
            df = pd.read_csv(file_path, encoding = "ISO-8859-1")
            dfs = prepare_df_data(df, body[0]['testType'], True)

            range_ra = "RA"
            range_psi = "PSI"
            range_old = "Stari"

            scopes = ['https://www.googleapis.com/auth/drive']
            key_path = environ.get("GOOGLE_KEY_PATH")
            api_port = environ.get("GOOGLE_API_PORT")
            if api_port:
                api_port = int(api_port)
            else:
                api_port = 8001
            flow = InstalledAppFlow.from_client_secrets_file(key_path, scopes)
            flow.redirect_uri = environ.get("REDIRECT_URI")
            credentials = flow.run_local_server(port=api_port)
            service = build('sheets', 'v4', credentials=credentials)
            sheet_vals_ra = open_sheet_for_reading(service, range_ra, environ.get("SHEET_ID"))
            sheet_vals_psi = open_sheet_for_reading(service, range_psi, environ.get("SHEET_ID"))
            sheet_vals_old = open_sheet_for_reading(service, range_old, environ.get("SHEET_ID"))

            sheet_body_ra = prepare_sheet_writing(sheet_vals_ra, dfs[0])
            sheet_body_psi = prepare_sheet_writing(sheet_vals_psi, dfs[1])
            sheet_body_old = prepare_sheet_writing(sheet_vals_old, dfs[2])

            open_sheet_for_writing(service, range_ra, environ.get("SHEET_ID"), sheet_body_ra)
            open_sheet_for_writing(service, range_psi, environ.get("SHEET_ID"), sheet_body_psi)
            open_sheet_for_writing(service, range_old, environ.get("SHEET_ID"), sheet_body_old)

            add_log(dfs, body[1]['email'])

            file.delete()
            remove(file_path)
            return HttpResponse(status=201)

    return HttpResponse(status=400)


@csrf_exempt
def exam_results(request):
    if request.method == "POST":
        body = request.body.decode('utf-8')
        body = loads(body)
        file_str = body[0]['file']
        user = body[1]['email'].split('@')

        file, file_path = parse_file_data(file_str, user[0], '.zip')

        zf = ZipFile(file_path, 'r')
        list_of_files = zf.namelist()
        csv_path = ""
        for file_name in list_of_files:
            if file_name.endswith('.csv'):
                csv_path = 'files/' + file_name
                zf.extract(file_name, 'files')
                break

        zf.close()
        file.delete()

        if not csv_path:
            return HttpResponse(status=400)
        exam_type = int(body[0]['examType'])
        df = pd.read_csv(csv_path)
        dfs = prepare_df_data(df, exam_type, False)

        range_ra = "RA"
        range_psi = "PSI"
        range_old = "Stari"

        scopes = ['https://www.googleapis.com/auth/drive']
        key_path = environ.get("GOOGLE_KEY_PATH")
        api_port = environ.get("GOOGLE_API_PORT")
        if api_port:
            api_port = int(api_port)
        else:
            api_port = 8001
        flow = InstalledAppFlow.from_client_secrets_file(key_path, scopes)
        flow.redirect_uri = os.environ.get("REDIRECT_URI")
        credentials = flow.run_local_server(port=api_port)
        service = build('sheets', 'v4', credentials=credentials)
        sheet_vals_ra = open_sheet_for_reading(service, range_ra, environ.get("SHEET_ID"))
        sheet_vals_psi = open_sheet_for_reading(service, range_psi, environ.get("SHEET_ID"))
        sheet_vals_old = open_sheet_for_reading(service, range_old, environ.get("SHEET_ID"))

        sheet_body_ra = prepare_sheet_writing(sheet_vals_ra, dfs[0])
        sheet_body_psi = prepare_sheet_writing(sheet_vals_psi, dfs[1])
        sheet_body_old = prepare_sheet_writing(sheet_vals_old, dfs[2])

        open_sheet_for_writing(service, range_ra, environ.get("SHEET_ID"), sheet_body_ra)
        open_sheet_for_writing(service, range_psi, environ.get("SHEET_ID"), sheet_body_psi)
        open_sheet_for_writing(service, range_old, environ.get("SHEET_ID"), sheet_body_old)
        add_log(dfs, body[1]['email'])
        remove(file_path)
        remove(csv_path)
        return HttpResponse(status=200)

    return HttpResponse(status=400)


@csrf_exempt
def get_logs(request):
    if request.method == "GET":
        logs = LogEntry.objects.all()
        serializer = LogEntrySerializer(logs,  many=True)
        return JsonResponse(data=serializer.data, safe=False, status=200)

    return HttpResponse(status=400)


@csrf_exempt
def get_statistics(request):
    if request.method == "GET":
        range_ra = "RA"
        range_psi = "PSI"
        range_old = "Stari"

        scopes = ['https://www.googleapis.com/auth/drive']
        key_path = environ.get("GOOGLE_KEY_PATH")
        api_port = environ.get("GOOGLE_API_PORT")
        if api_port:
            api_port = int(api_port)
        else:
            api_port = 8001
        flow = InstalledAppFlow.from_client_secrets_file(key_path, scopes)
        flow.redirect_uri = os.environ.get("REDIRECT_URI")
        credentials = flow.run_local_server(port=api_port)
        service = build('sheets', 'v4', credentials=credentials)
        sheet_vals_ra = open_sheet_for_reading(service, range_ra, environ.get("SHEET_ID"))
        sheet_vals_psi = open_sheet_for_reading(service, range_psi, environ.get("SHEET_ID"))
        sheet_vals_old = open_sheet_for_reading(service, range_old, environ.get("SHEET_ID"))

        sheet_df_ra = pd.DataFrame(sheet_vals_ra, columns=sheet_vals_ra[0])
        sheet_df_ra = sheet_df_ra.iloc[1:, :]

        sheet_df_psi = pd.DataFrame(sheet_vals_psi, columns=sheet_vals_psi[0])
        sheet_df_psi = sheet_df_psi.iloc[1:, :]

        sheet_df_old = pd.DataFrame(sheet_vals_old, columns=sheet_vals_old[0])
        sheet_df_old = sheet_df_old.iloc[1:, :]

        dfs = [sheet_df_ra, sheet_df_psi, sheet_df_old]
        stats = stats_serializer(dfs)
        stats = TableSerializer(stats, many=True)
        return JsonResponse(data=stats.data, safe=False, status=200)

    return HttpResponse(status=400)