import './styles.css';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { requestBackend } from '../../../../util/requests';
import { toast } from 'react-toastify';
import { AxiosRequestConfig } from 'axios';
import { Employee } from 'types/employee';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Department } from 'types/department';

const Form = () => {

  const history = useHistory();

  const [selectDepartment, setSelectDepartment] = useState<Department[]>([]);

  const { 
    register, 
    handleSubmit, 
    formState: {errors},
    control
    } = useForm<Employee>();

    useEffect(() => {
      requestBackend({url: '/departments', withCredentials: true})
      .then(response => {
        setSelectDepartment(response.data);
      })
  }, []);

  const onSubmit = (formData : Employee) => {

    const data = {...formData}

    const config : AxiosRequestConfig = {
        method: 'POST',
        url: `/employees`,
        data: data,
        withCredentials: true
    };

    requestBackend(config)
    .then(response => {
        history.push("/admin/employees");
        toast.info("Cadastrado com sucesso");
    });
};

  const handleCancel = () => {
    history.push("/admin/employees");
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className='margin-bottom-30'>
                  <input
                  {...register("name", {
                      required: 'Campo obrigatório',
                  })}
                  type="text"
                  className={`form-control base-input ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Nome do Funcionário"
                  name="name"
                  data-testid="name"
                  />
                <div className="d-block invalid-feedback">{errors.name?.message}</div>
              </div>
              
              
              <div className='margin-bottom-30'>
                  <input
                  {...register("email", {
                      required: 'Campo obrigatório',
                      pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm, 
                          message: 'Email inválido'
                      }
                  })}
                  type="text"
                  className={`form-control base-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email do Funcionário"
                  name="email"
                  data-testid="email"
                  />
                  <div className="d-block invalid-feedback">{errors.email?.message}</div>
                </div>

                <div className='margin-bottom-30'>
                  <label htmlFor="department" className='d-none'>Departamento</label>
                <Controller
                        name='department'
                        rules={{required: true}}
                        control={control}
                        render={({field}) => (

                            <Select {...field}
                            options={selectDepartment}
                            
                            getOptionLabel={(department: Department) => department.name}
                            getOptionValue={(department: Department) => String(department.id)}
                            inputId='department'
                            />

                        )}
                    />
                    {errors.department && (
                        <div className="d-block invalid-feedback">Campo obrigatório</div>
                      )
                    }

                </div>

            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
