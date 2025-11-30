//npm install @react-google-maps/api
import { useJsApiLoader } from "@react-google-maps/api";
import PlaceAutocomplete from "./PlaceAutocomplete";

const libraries = ["places"]; // importante para usar o Autocomplete

export default function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "Google_API_KEY_AQUI",
    libraries,
  });

  if (loadError) return <div>Erro ao carregar o Google Maps API</div>;
  if (!isLoaded) return <div>Carregando...</div>;

  return <PlaceAutocomplete />;
}

// Exemplo .jsx
// function funcaoExemplo(params) {
//   // Cria uma instância do AutocompleteService
//   const service = new window.google.maps.places.AutocompleteService();
  
//   /** @type {google.maps.places.AutocompleteRequest} */
//   const request = {
//       input,
//       types: ["address"], // você pode trocar para ["(cities)"], ["establishment"], etc.
//       componentRestrictions: { country: "br" },
//     };



//     // Chama o serviço de previsão
//     service.getPlacePredictions(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
//         setPredictions(results);
//       } else {
//         setPredictions([]);
//       }
//     });
//   }, [input]);

// }s
    