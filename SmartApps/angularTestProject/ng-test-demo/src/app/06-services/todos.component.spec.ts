import { TodosComponent } from './todos.component'; 
import { TodoService } from './todo.service'; 
import { Observable } from 'rxjs';
import { from } from 'rxjs';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let service:TodoService;

  beforeEach(() => {
    service = new TodoService(null);
    component = new TodosComponent(service);
  });

  it('should set todos property with the items returned from the server', () => {
    
    let todos = [1,2,3];

    spyOn(service, 'getTodos').and.callFake(() => {

/*       return from([[
        {id:1, title: 'a'},
        {id:2, title: 'b'},
        {id:3, title: 'c'}
      ]]) */

      return from([[1,2,3]])
    })

    component.ngOnInit();
    // expect(component.todos.length).toBeGreaterThan(0);
    expect(component.todos).toEqual(todos);
    
  });
});