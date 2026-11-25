Feature: To-Do Manager - Core Flows and Validation
  As a user
  I want to manage my tasks (add, view, complete, delete, filter, search)
  So that I can track what needs to be done

Background:
  Given the To-Do Manager app is open

@tasks
Scenario: Show empty state when there are no tasks
  Then I should see "No tasks yet. Add your first task above."

@tasks
Scenario: Add a new pending task
  When I add a new task with title "Buy milk"
  Then I should see the task "Buy milk" in the task list
  And the task "Buy milk" should be marked as pending
  And the new-task input should be cleared

@validation
Scenario: Prevent adding an empty task
  When I try to add a new task with title ""
  Then no new task should be added
  And I should still see "no tasks" empty state

@validation
Scenario: Prevent adding a whitespace-only task
  When I try to add a new task with title "   "
  Then no new task should be added

@toggle
Scenario: Mark a task as completed and back to pending
  Given I have a task titled "Pay rent"
  When I mark the task "Pay rent" as completed
  Then the task "Pay rent" should be marked as completed
  And the completed count should increase
  When I mark the task "Pay rent" as pending
  Then the task "Pay rent" should be marked as pending

@delete
Scenario: Delete a task
  Given I have a task titled "Call the doctor"
  When I delete the task "Call the doctor"
  Then the task "Call the doctor" should not be visible in the task list

@filter
Scenario: Filter tasks by Pending
  Given I have tasks:
    | title | completed |
    | Task A | false |
    | Task B | true  |
  When I select the "Pending" filter
  Then I should see only pending tasks
  And I should not see completed tasks

@filter
Scenario: Filter tasks by Completed
  Given I have tasks:
    | title | completed |
    | Task A | false |
    | Task B | true  |
  When I select the "Completed" filter
  Then I should see only completed tasks
  And I should not see pending tasks

@filter
Scenario: Search tasks by text across all tasks
  Given I have tasks:
    | title | completed |
    | Buy milk | false |
    | Buy bread | true  |
    | Read book | false |
  When I search for "buy"
  Then I should see tasks containing "buy"
  And I should not see tasks that do not match the search

@empty-states
Scenario: Show a contextual empty state when no tasks match search
  Given I have a task titled "Walk the dog"
  When I search for "zzz"
  Then I should see "No tasks match your search."
  And I should see a "Clear filters" button

@empty-states
Scenario: Show a contextual empty state when no pending tasks exist
  Given I have tasks:
    | title | completed |
    | Task A | true  |
    | Task B | true  |
  When I select the "Pending" filter
  Then I should see "No pending tasks."
  And I should see a "Clear filters" button

@persistence
Scenario: Persist tasks to LocalStorage and restore on reload
  When I add a new task with title "Pack lunch"
  And I reload the page
  Then I should see the task "Pack lunch" in the task list
