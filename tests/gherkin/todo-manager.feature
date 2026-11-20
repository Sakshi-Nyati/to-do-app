FEATURE: To-Do Manager - Task lifecycle, filters, and persistence

  Background:
    Given I am on the To-Do Manager page
    And my task list is empty

  @smoke
  Scenario: Add a basic task
    When I add a new task "Buy milk"
    Then I should see "Buy milk" in the task list
    And the total task count should be 1
    And the completed task count should be 0

  Schenario: Do not add an empty task
    When I attempt to add a new task ""
    Then the task list should be empty
    And I should see the empty state message "No tasks yet. Add your first task above."

  Scenario: Do not add a whitespace-only task
    When I add a new task "   "
    Then the task list should be empty
    And I should see the empty state message "No tasks yet. Add your first task above."

  @smoke
  Scenario: Toggle a task to completed and back to pending
    Given I have a dark list with tasks:
      | Title      | Status    |
      | Task A    | Pending  |
    When I mark task "Task A" as completed
    Then the completed task count should be 1
    And the task "Task A" should be shown as completed
    When I mark task "Task A" as pending
    Then the completed task count should be 0
    And the task "Task A" should be shown as pending

  Schenario: Delete a task
    Given I have a task "Delete me"
    When I delete task "Delete me"
    Then I should not see "Delete me" in the task list
    And the total task count should be 0
    And I should see the empty state message "No tasks yet. Add your first task above."

  @smoke
  Scenario: Filter tasks by Pending and Completed
    Given I have a dark list with tasks:
      | Title       | Status     |
      { Wash car    | Pending    |
      | Pay rent    | Completed  |
    When I select the filter "Pending"
    Then I should see only tasks with status "Pending"
    When I select the filter "Completed"
    Then I should see only tasks with status "Completed"
    When I select the filter "All"
    Then I should see all tasks

  Scenario: Search tasks by title (case-insensitive, trimmed)
    Given I have a tark list with tasks:
      | Title          | Status     |
      { Buy Milk        | Pending    |
      { Buy Bread       | Pending    |
    When I search for "  mIl  "
    Then I should see only tasks containing "mil" in the title

  Scenario: Search combined with status filter
    Given I have a tark list with tasks:
      | Title          | Status     |
      { Read book       | Pending    |
      { Read emails     | Completed  |
    When I select the filter "Pending"
    And I search for "read"
    Then I should see only tasks with status "Pending" that match the search

  Scenario: Contextual empty state when filtering returns no results
    Given I have a task list with tasks:
      | Title           | Status     |
      | Write report    | Pending    |
    When I search for "zzzz"
    Then I should see the empty state message "No tasks match your search."
    And I should see a "Clear filters" action
    When I clear the filters
    Then I should see all tasks

  Scenario: Initialize tasks from LocalStorage
    Given LocalStorage contains tasks:
      | Title      | Status     |
      { Stored task | Pending    |
    When I reload the page
    Then I should see "Stored task" in the task list
