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
    cases?: Record<string, Case>;
    outlines?: Record<string, Drawing>;
    pcbs?: Record<string, string>;
    points?: Record<string, Point>;
    demo?: Drawing;
    units?: Record<string, number>;
  }

  export function inject(
    type: 'footprint' | 'template',
    name: string,
    value: (params: unknown) => unknown,
  ): void;
  export async function process(
    input: string,
    debug: boolean,
    logger: (string, string) => void,
  ): Promise<Results>;
}
