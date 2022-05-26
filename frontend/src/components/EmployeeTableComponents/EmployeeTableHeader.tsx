import * as React from 'react';
import { Component, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import '../../styles/EmployeeTableHeader.scss';
import { DELETE_EMPLOYEE_MUTATION } from '../../graphql/deleteEmployeeMutation';
import { EMPLOYEES_QUERY } from '../../graphql/employeesQuery';
import { useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput';
import Button from '../Button';

const RecordOperations = (props: {
  selectedEmployees: Array<string>;
  setSelectedEmployees: Dispatch<SetStateAction<Array<string>>>;
}) => {
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE_MUTATION, {
    refetchQueries: [EMPLOYEES_QUERY, 'EmployeesQuery']
  });
  const [deleteDisabled, setDeleteDisabled] = useState(true);
  const navigate = useNavigate();

  // Handle the deleted of an employee
  const handleDeleteEmployee = (id: string) => {
    deleteEmployee({ variables: { id: id } })
      .then(() => {
        // Set selected employees to an empty array after deleting one
        props.setSelectedEmployees([]);
      })
      .catch((error) => {
        // Throw error if necessary
        console.assert(error);
      });
  };

  // Set the state of the delete employee button to enabled if the number of selected records is exactly 1
  useEffect(() => {
    props.selectedEmployees.length === 1 ? setDeleteDisabled(false) : setDeleteDisabled(true);
  });

  return (
    <td colSpan={3} id="recordOperationsContainer">
      <Button
        text="Add New Employee"
        handleClick={() => navigate('/create-employee')}
        disabled={false}
      />
      <Button
        text="Delete Selected Employee"
        disabled={deleteDisabled}
        handleClick={() => handleDeleteEmployee(props.selectedEmployees[0])}
      />
    </td>
  );
};

interface EmployeeTableFooterProps {
  employeeCount: number;
  selectedEmployees: Array<string>;
  setSelectedEmployees: Dispatch<SetStateAction<Array<string>>>;
  setSearchField: Dispatch<SetStateAction<string>>;
}

class EmployeeTableHeader extends Component<EmployeeTableFooterProps> {
  constructor(props: EmployeeTableFooterProps | Readonly<EmployeeTableFooterProps>) {
    super(props);
  }

  render() {
    return (
      <thead>
        <tr id="tableInfoContainer">
          <td colSpan={4} id="employeeDataContainer">
            <p>Total Employees: {this.props.employeeCount}</p>
            <SearchInput setSearchField={this.props.setSearchField} />
          </td>
          <RecordOperations
            selectedEmployees={this.props.selectedEmployees}
            setSelectedEmployees={this.props.setSelectedEmployees}
          />
        </tr>
        <tr>
          <th />
          <th id="directoryImageHeader" />
          <th>Forename</th>
          <th>Surname</th>
          <th>Job Title</th>
          <th>Email</th>
          <th>Phone Number</th>
        </tr>
      </thead>
    );
  }
}

export default EmployeeTableHeader;
