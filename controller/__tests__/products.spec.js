const {
  pagination,
} = require('../../utils/utils');

const objectExample = {
  docs: [
    {
      _id: '6130d68363b45c72863f2e15',
      name: 'Test',
      price: 20,
      dateEntry: '2021-09-02T13:49:55.297Z',
      __v: 0,
    },
  ],
  totalDocs: 1,
  limit: 1,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

const url = 'http://localhost:8080/products';
const firstPage = 'http://localhost:8080/products?limit=10&page=1';

describe('pagination ', () => {
  it('should return an object', () => {
    expect(typeof pagination(objectExample, url, 1, 10, objectExample.totalPages)).toBe('object');
  });
  it('should return an object with links', () => {
    expect(pagination(objectExample, url, 1, 10, objectExample.totalPages).first).toBe(firstPage);
  });
});
