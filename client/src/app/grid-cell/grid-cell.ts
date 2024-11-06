import { Edges } from './edges';
import { Colors } from './colors';

export class GridCell {
  editable: boolean = true;
  value: string = '';
  edges: Edges = { top: false, right: false, bottom: false, left: false };
  // Each boolean coresponds to an edge, true means it is bolded.

}
