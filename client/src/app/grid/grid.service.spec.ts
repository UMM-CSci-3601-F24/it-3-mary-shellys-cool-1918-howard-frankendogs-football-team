import { TestBed, waitForAsync } from '@angular/core/testing';

import { GridService } from './grid.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Grid } from './grid';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('GridService', () => {
  // const testGrids: Grid[] = [] //this is intentionally empty
  let gridService: GridService;
  let httpClient: HttpClient;
  let httpTestingController : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()),provideHttpClientTesting()]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    gridService = TestBed.inject(GridService);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(gridService).toBeTruthy();
  });

  describe('When saveGrid is called', () => {
    it("calls /grids with `post` command", waitForAsync(() => {
      const grid: Grid = {
          _id:"hehe",
          owner:"haha",
          grid: [
            [{
              editable: true,
              value: "w",
              edges: {top: false, right: false, bottom: false, left: false}
              },
              {
              editable: true,
              value: "x",
              edges: {top: false, right: false, bottom: false, left: false}
              },
            ],
            [{
              editable: true,
              value: "y",
              edges: {top: false, right: false, bottom: false, left: false}
              },
              {
              editable: true,
              value: "z",
              edges: {top: false, right: false, bottom: false, left: false}
              },
            ]
          ]
      }
      const mockedMethod = spyOn(httpClient, "post").and.returnValue(of("hehe"));
      gridService.saveGrid(grid).subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith(gridService.gridUrl, grid)
      })
    }));
  });
});
