from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import Todo

def todo_list(request):
    todos = Todo.objects.all().order_by('-created_at')
    total = todos.count()
    completed = todos.filter(is_resolved=True).count()
    progress = int((completed / total) * 100) if total > 0 else 0
    return render(request, 'todo/home.html', {'todos': todos, 'progress': progress})

@require_http_methods(["POST"])
def todo_create(request):
    title = request.POST.get('title')
    description = request.POST.get('description', '')
    due_date = request.POST.get('due_date') or None
    
    if title:
        Todo.objects.create(
            title=title, 
            description=description,
            due_date=due_date
        )
    return redirect('todo_list')

def todo_update(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == "POST":
        todo.title = request.POST.get('title')
        todo.description = request.POST.get('description', '')
        todo.due_date = request.POST.get('due_date') or None
        todo.save()
        return redirect('todo_list')
    return render(request, 'todo/todo_form.html', {'todo': todo})

def todo_delete(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == "POST":
        todo.delete()
        return redirect('todo_list')
    return render(request, 'todo/todo_confirm_delete.html', {'todo': todo})

def todo_toggle_status(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    todo.is_resolved = not todo.is_resolved
    todo.save()
    return redirect('todo_list')
