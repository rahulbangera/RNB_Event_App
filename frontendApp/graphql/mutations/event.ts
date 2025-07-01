import { gql } from "graphql-request";

export const CREATE_EVENT_MUTATION = gql`
mutation MyMutation($description: String = "", $startTime: String = "", $name: String = "", $location: String = "") {
  createEvent(
    data: {location: $location, description: $description, name: $name, startTime: $startTime}
  ) {
    name
  }
}
  `;

export const GET_EVENTS_QUERY = gql`
query MyQuery {
  getEvents {
    ... on Error {
      message
    }
    ... on QueryGetEventsSuccess {
      __typename
      data {
        description
        id
        imageUrl
        location
        name
        startTime
        attendee {
          id
        }
      }
    }
  }
}`;

export const GET_TOP_FIVE_ATTENDEES_QUERY = gql`
query getTopFiveAttendees($eventId: ID = "") {
  getTopFiveAttendees(eventId: $eventId) {
    ... on Error {
      message
    }
    ... on QueryGetTopFiveAttendeesSuccess {
      __typename
      data {
        imageUrl
      }
    }
  }
}
  `;

export const ADD_ATTENDEE_MUTATION = gql`
mutation addAttendeeToEvent($eventId: ID = "", $userId: ID = "") {
  addAttendeeToEvent(eventId: $eventId, userId: $userId) {
    ... on Error {
      message
    }
    ... on MutationAddAttendeeToEventSuccess {
      __typename
    }
  }
}`;
