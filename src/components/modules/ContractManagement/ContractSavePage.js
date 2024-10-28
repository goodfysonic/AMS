import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, message, Form } from 'antd';
import ContractForm from './ContractForm';
import axios from 'axios';

const ContractSavePage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();
  const API_URL = 'http://localhost:8080/master/api';

  useEffect(() => {
    if (contractId) {
      fetchContractDetails();
    }
  }, [contractId]);

  const fetchContractDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/contracts/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialValues(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch contract details');
      navigate('/contracts');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = contractId ? 'put' : 'post';
      const endpoint = contractId ? `${API_URL}/contracts/${contractId}` : `${API_URL}/contracts`;

      await axios[method](endpoint, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(`Contract ${contractId ? 'updated' : 'created'} successfully`);
      navigate('/contracts');
    } catch (error) {
      message.error(`Failed to ${contractId ? 'update' : 'create'} contract`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card
        title={<h2 className="text-xl font-semibold">{contractId ? 'Edit Contract' : 'Create New Contract'}</h2>}
        className="shadow-sm rounded-lg"
      >
        <ContractForm
          form={form}
          initialValues={initialValues}
          onFinish={handleSubmit}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ContractSavePage;
