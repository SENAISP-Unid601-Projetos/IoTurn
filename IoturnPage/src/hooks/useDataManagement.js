// UseDataManagement com refresh automático - João Perez

import { useState, useEffect, useMemo, useCallback } from "react";

/**
 @param {Function} fetchFunction
 @param {Function} filterCallback
 @returns {Object},

 **/
export const useDataManagement = (fetchFunction, filterCallback) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result || []); 
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(
        `Falha ao carregar os dados. Erro: ${err.message || "Desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]); 

  useEffect(() => {
    loadData();
  }, [loadData]); 

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      return data;
    }
    return data.filter((item) => filterCallback(item, term));
  }, [data, searchTerm, filterCallback]);

  return {
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetchData: loadData, 
  };
};


//UseDataMAnaement antigo.

// import { useState, useEffect, useMemo } from 'react';

// /**
//  * Hook personalizado para gerenciar o carregamento, erro,
//  * busca e filtragem de dados para as páginas de gerenciamento.
//  *
//  * @param {Function} fetchFunction
//  * @param {Function} filterCallback
//  * @returns {Object}
//  */
// export const useDataManagement = (fetchFunction, filterCallback) => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 setLoading(true);
//                 const result = await fetchFunction();
//                 setData(result);
//                 setError(null);
//             } catch (err) {
//                 console.error("Erro ao carregar dados:", err);
//                 setError(`Falha ao carregar os dados. Erro: ${err.message || 'Desconhecido'}`);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadData();
//     }, [fetchFunction]);

//     const filteredData = useMemo(() => {
//         const term = searchTerm.toLowerCase();
//         if (!term) {
//             return data;
//         }
//         return data.filter(item => filterCallback(item, term));
//     }, [data, searchTerm, filterCallback]);

//     return {
//         filteredData,
//         loading,
//         error,
//         searchTerm,
//         setSearchTerm,
//     };
// };
