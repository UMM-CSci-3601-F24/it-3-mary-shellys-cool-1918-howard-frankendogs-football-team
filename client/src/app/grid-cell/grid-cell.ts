import { Edges } from './edges';

export class GridCell {
  editable: boolean = true;
  value: string = '';
  edges: Edges = { top: false, right: false, bottom: false, left: false };
  color: string = 'white';
  // Each boolean coresponds to an edge, true means it is bolded.
}
