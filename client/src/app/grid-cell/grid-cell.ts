import { Edges } from './edges';

export class GridCell {
  editable: boolean = true;
  value: string = '';
  edges: Edges = { top: false, right: false, bottom: false, left: false };
  blackedOut: boolean = false;
  // Each boolean coresponds to an edge, true means it is bolded.
}
