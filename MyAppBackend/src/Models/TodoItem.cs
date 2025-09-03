namespace MyApp.Models;

public class TodoItem
{
    public int Id { get; set; }           // PK
    public string Title { get; set; } = "";
    public bool IsDone { get; set; }
}
