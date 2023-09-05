import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { BASE_URL, requestBackend } from 'util/requests';
import { SpringPage } from 'types/vendor/spring';
import { hasAnyRoles } from 'util/auth';

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const getEmployee = (pageNumber: number) => {
      const config : AxiosRequestConfig = {
          method: 'GET',
          url: `/employees`,
          baseURL: BASE_URL,
          params: {
              page: pageNumber,
              size: 4,
  
          },
          withCredentials: true
      }
      
      requestBackend(config)
      .then(response => {
        setPage(response.data);
      })
  };

useEffect(() => {

    getEmployee(0);

    }, []);

  const handlePageChange = (pageNumber: number) => {
    getEmployee(pageNumber);
  };

  return (
    <>
      <Link to="/admin/employees/create">
        {hasAnyRoles(['ROLE_ADMIN']) &&(     
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        )}
      </Link>

      {page?.content.map(employee => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={ (page) ? page.totalPages : 0} 
        range={ (page) ? page.size : 3} 
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
