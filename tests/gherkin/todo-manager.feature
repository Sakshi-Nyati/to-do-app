Feature: To-Do Manager – Manage tasks and persist them

  Background:
    Given I open the To-Do Manager app

  @smoke
  Scenario: App loads and shows core UI
    Then I see the page title "To-Do Manager"
    And I see an input field labeled "New task"
    And I see an "Add task" button
    And I see filter buttons for "All", "Pending", and "Completed"

  Scenario: Add a basic task
    When I add a task titled "Buy milk"
    Then I see the task "Buy milk" in the task list

  Scenario: Trim whitespace when adding a task
    When I add a task titled "  File taxes  "
    Then I see the task "File taxes" in the task list
    And I do not see a task titled "  File taxes  "

  Scenario: Input validation rejects empty task
    When I try to add a blank task
    Then I see no new task added to the list

  Scenario: Input validation rejects whitespace-only task
    When I try to add a whitespace-only task
    Then I see no new task added to the list

  Scenario: Toggle a task to completed and back to pending
    Given I have a task titled "Water plants"
    When I mark the task "Water plants" as completed
    Then the task "Water plants" is shown as completed
    When I mark the task "Water plants" as pending
    Then the task "Water plants" is shown as pending

  Scenario: Delete a task
    Given I have a task titled "Clean desk"
    When I delete the task "Clean desk"
    Then I do not see the task "Clean desk" in the task list

  Scenario: Filter tasks by Pending
    Given I have the following tasks:
      | Title | Completed |
      | Task A | false |
      | Task B | true |
    When I select the "Pending" filter
    Then I see only the pending tasks in the list

  Scenario: Filter tasks by Completed
    Given I have the following tasks:
      | Title | Completed |
      | Task A | false |
      | Task B | true |
    When I select the "Completed" filter
    Then I see only the completed tasks in the list

  Scenario: Search tasks by title
    Given I have the following tasks:
      | Title | Completed |
      | Buy milk | false |
      | Write report | false |
    When I search for "milk"
    Then I see only tasks containing "milk"

  Scenario: Clear filters from empty state
    Given I have a task titled "Task A"
    And I mark the task "Task A" as completed
    When I select the "Pending" filter
    Then I see an empty state message
    And I can click "Clear filters"
    When I clear filters
    Then I see the task "Task A" in the list

  Scenario: Persists tasks in localStorage after reload
    When I add a task titled "Pay bills"
    And I reload the page
    Then I see the task "Pay bills" in the task list

  Scenario: Initializes with empty task list when no stored data
    Given localStorage is cleared for task storage
    When I open the To-Do Manager app
    Then I see the empty task list message

  Scenario: Edit task title and save
    Given I!have a task titled "Old title"
    When I edit the task "Old title" to "New title" and save
    Then I see the task title is updated to "New title"

  Scenario: Cancel editing a task title
    Given I!have a task titled "Do not change"
    When I start editing the task "Do not change"
    And I cancel the edit
    Then I still see the task "Do not change" in the list

  Scenario: Prevent saving an empty edit
    Given I have a task titled "ToDo"
    When I start editing the task "ToDo"
    And I replace the title with whitespace
    Then the "Save" button is disabled