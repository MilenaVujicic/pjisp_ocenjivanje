export interface ResultsFormat{
  resultType:string;
  examType?:string;
  testType?:string;
  file: string | ArrayBuffer | null;
}
