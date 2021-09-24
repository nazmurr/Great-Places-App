import * as FileSystem from "expo-file-system";

import { insertPlace, fetchPlaces, deletePlace } from "../helpers/db";
import ENV from "../env";

export const ADD_PLACE = "ADD_PLACE";
export const SET_PLACES = "SET_PLACES";
export const DELETE_PLACE = "DELETE_PLACE";

export const addPlace = (title, image, location) => {
  return async (dispatch) => {
    let address = "";
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${ENV.googleApiKey}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      if (!resData.results.length) {
        throw new Error(resData.error_message);
      }

      address = resData.results[0].formatted_address;
    } catch (error) {
      //console.log(error);
    }

    const fileName = image.split("/").pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath,
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.lat,
        location.lng
      );
      // console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address: address,
          coords: {
            lat: location.lat,
            lng: location.lng,
          },
        },
      });
    } catch (err) {
      //console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch) => {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      //console.log(files);
      const dbResult = await fetchPlaces();
      // console.log(dbResult);
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};

export const removePlace = (id, imageUrl) => {
  return async (dispatch) => {
    try {
      await FileSystem.deleteAsync(imageUrl);
      const dbResult = await deletePlace(id);
      //console.log(dbResult);
      dispatch({
        type: DELETE_PLACE,
        placeData: {
          id,
        },
      });
    } catch (err) {
      //console.log(err);
      throw err;
    }
  };
};
