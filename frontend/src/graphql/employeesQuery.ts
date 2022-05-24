import { gql } from '@apollo/client';

export const EMPLOYEES_QUERY = gql`
  query EmployeesQuery {
    employees {
      email
      phoneNumber
      forename
      surname
      profileImage
      title
    }
  }
`;
