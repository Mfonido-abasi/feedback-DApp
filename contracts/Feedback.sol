// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeedbackDApp {
    struct Feedback {
        address user;
        string message;
    }

    Feedback[] public feedbacks;

    event FeedbackSubmitted(address indexed user, string message);

    function submitFeedback(string memory _message) public {
        feedbacks.push(Feedback(msg.sender, _message));
        emit FeedbackSubmitted(msg.sender, _message);
    }

    function getAllFeedbacks() public view returns (Feedback[] memory) {
        return feedbacks;
    }
}