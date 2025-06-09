declare module 'react-easy-panzoom' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface PanZoomProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    enableBoundingBox?: boolean;
    boundaryRatioVertical?: number;
    boundaryRatioHorizontal?: number;
    autoCenter?: boolean;
    autoCenterZoomLevel?: number;
    zoomSpeed?: number;
    doubleZoomSpeed?: number;
    disabled?: boolean;
    disableDoubleClickZoom?: boolean;
    disableScrollZoom?: boolean;
    disableKeyInteraction?: boolean;
    realPinch?: boolean;
    keyMapping?: Record<string, string>;
    minZoom?: number;
    maxZoom?: number;
    enablePan?: boolean;
    onPanStart?: () => void;
    onPan?: () => void;
    onPanEnd?: () => void;
    onZoom?: (event: Event) => void;
  }

  const PanZoom: ComponentType<PanZoomProps>;
  export default PanZoom;
}
