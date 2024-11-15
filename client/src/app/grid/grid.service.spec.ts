import { TestBed, waitForAsync } from '@angular/core/testing';

import { GridService } from './grid.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GridPackage } from './gridPackage';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('GridService', () => {
  // const testGrids: Grid[] = [] //this is intentionally empty
  let gridService: GridService;
  let httpClient: HttpClient;
  let httpTestingController : HttpTestingController;
  const testGrid: GridPackage = {
    _id:"hehe",
    roomID:"haha",
    grid: [
      [{
        editable: true,
        value: "w",
        edges: {top: false, right: false, bottom: false, left: false},
        color: ''
        },
        {
        editable: true,
        value: "x",
        edges: {top: false, right: false, bottom: false, left: false},
        color: ''
        },
      ],
      [{
        editable: true,
        value: "y",
        edges: {top: false, right: false, bottom: false, left: false},
        color: ''
        },
        {
        editable: true,
        value: "z",
        edges: {top: false, right: false, bottom: false, left: false},
        color: ''
        },
      ]
    ]
}

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
      const mockedMethod = spyOn(httpClient, "post").and.returnValue(of("hehe"));
      gridService.saveGrid(testGrid).subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith("/api/grids", testGrid)
      })
    }));
  });

  describe('When saveGrid is called', () => {
    it("calls /grids with `post` command", waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, "post").and.returnValue(of("hehe"));
      gridService.saveGrid(testGrid).subscribe(() => {
        expect(mockedMethod).toHaveBeenCalledWith('/api/grids', testGrid);
      });
    }));
  });

  describe('When getGrid is called', () => {
    it("calls /grids/:id with `get` command", waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, "get").and.returnValue(of(testGrid));
      gridService.getGridById('hehe').subscribe(() => {
        expect(mockedMethod).toHaveBeenCalledWith('/api/grids/hehe');
      });
    }));
  });

  describe('getting grids', () => {
    it('getGrids() makes correct call', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testGrid));
      gridService.getGrids().subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext("talks to correct endpoint").toHaveBeenCalledWith("/api/grids");
      })
    }));
    it('getGridById() makes right call', waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testGrid));
      gridService.getGridById("hehe").subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext("talks to correct endpoint").toHaveBeenCalledWith("/api/grids/hehe");
      })
    }));
  });

  describe('When saveGridWithRoomId is called', () => {
    it("calls /grids with `post` command and roomId", waitForAsync(() => {
      const mockedMethod = spyOn(httpClient, "post").and.returnValue(of("hehe"));
      gridService.saveGridWithRoomId("roomId", testGrid).subscribe(() => {
        expect(mockedMethod).withContext('one call').toHaveBeenCalledTimes(1);
        expect(mockedMethod).withContext('talks to correct endpoint').toHaveBeenCalledWith("/api/grids", testGrid);
      });
    }));
  });
});
