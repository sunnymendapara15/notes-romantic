using NotesApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors();

var notes = new List<Note>();

app.MapGet("/notes", () => Results.Ok(notes));

app.MapPost("/notes", (NoteCreate request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title) && string.IsNullOrWhiteSpace(request.Content))
    {
        return Results.BadRequest(new { message = "Provide a title or content before saving." });
    }

    var note = new Note
    {
        Id = Guid.NewGuid(),
        Title = request.Title?.Trim() ?? string.Empty,
        Content = request.Content?.Trim() ?? string.Empty,
        CreatedAt = DateTime.UtcNow
    };

    notes.Add(note);
    return Results.Created($"/notes/{note.Id}", note);
});

app.MapPut("/notes/{id:guid}", (Guid id, NoteUpdate request) =>
{
    var note = notes.FirstOrDefault(n => n.Id == id);
    if (note is null)
    {
        return Results.NotFound();
    }

    note.Title = request.Title?.Trim() ?? note.Title;
    note.Content = request.Content?.Trim() ?? note.Content;
    note.UpdatedAt = DateTime.UtcNow;

    return Results.Ok(note);
});

app.MapDelete("/notes/{id:guid}", (Guid id) =>
{
    var note = notes.FirstOrDefault(n => n.Id == id);
    if (note is null)
    {
        return Results.NotFound();
    }

    notes.Remove(note);
    return Results.NoContent();
});

app.Run();

record NoteCreate(string Title, string Content);
record NoteUpdate(string Title, string Content);
