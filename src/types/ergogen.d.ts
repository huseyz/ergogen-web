declare module 'ergogen' {

  export interface Drawing {
    svg: string;
    dxf: string;
  }

  export interface Case {
    jscad: string;
  }

  export interface Point {
    x: number;
    y: number;
    r: number;
  }

  export interface Results {
    cases?: { [key: string]: Case };
    outlines?: { [key: string]: Drawing };
    pcbs?: { [key: string]: string };
    points?: { [key: string]: Point };
    demo?: Drawing;
    units?: { [key: string]: number };
  }

  export function inject(type: "footprint" | "template", name: string, value: Function): void
  export async function process(input: string, debug: boolean, logger: (string, string) => void): Promise<Results>

};