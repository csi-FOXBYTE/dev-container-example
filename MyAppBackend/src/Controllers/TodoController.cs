using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Models;

namespace MyApp.Controllers;

[Route("api/todo")]
[ApiController]
public class TodoController : ControllerBase
{
    private readonly TodoContext _context;

    public TodoController(TodoContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems(CancellationToken ct)
        => await _context.TodoItems.AsNoTracking().ToListAsync(ct);

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetTodoItem(int id, CancellationToken ct)
    {
        var todoItem = await _context.TodoItems.FindAsync([id], ct);
        return todoItem is null ? NotFound() : todoItem;
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodoItem([FromBody] TodoItem todoItem, CancellationToken ct)
    {
        // Prevent clients from setting Id
        todoItem.Id = 0;

        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync(ct);

        return CreatedAtAction(
            nameof(GetTodoItem),
            new { id = todoItem.Id },
            todoItem);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTodoItem(int id, CancellationToken ct)
    {
        var todoItem = await _context.TodoItems.FindAsync([id], ct);
        if (todoItem is null) return NotFound();

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync(ct);
        return NoContent();
    }
}
