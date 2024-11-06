import { Edges } from './edges';
import { Colors } from './colors';

export class GridCell {
  editable: boolean = true;
  value: string = '';
  edges: Edges = { top: false, right: false, bottom: false, left: false };
  color: Colors = { yellow: false, green: false, red: false };
  // Each boolean coresponds to an edge, true means it is bolded.


  toggleTopEdge() {
    this.edges.top = !this.edges.top;
  }

  toggleRightEdge() {
    this.edges.right = !this.edges.right;
  }

  toggleBottomEdge() {
    this.edges.bottom = !this.edges.bottom;
  }

  toggleLeftEdge() {
    this.edges.left = !this.edges.left;
  }

  toggleYellowColor() {
    this.color.yellow = !this.color.yellow;
  }

  toggleGreenColor() {
    this.color.green = !this.color.green;
  }

  toggleRedColor() {
    this.color.red = !this.color.red;
  }

}
