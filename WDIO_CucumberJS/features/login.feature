Feature: Performing a login

    Background:
        Given I'm on the login page

    Scenario: Login with default credentials
        When I log in with a default user
        Then I Shall be on the userinfo page
        

