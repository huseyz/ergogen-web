export interface CustomFootprintConfig {
  id: number;
  name: string;
  content: string;
}

export interface ConfigBundle { 
  name: string; 
  config: string; 
  customFootprints: CustomFootprintConfig[] 
}