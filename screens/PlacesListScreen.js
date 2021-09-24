import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import PlaceItem from "../components/PlaceItem";
import SwipeableRowComp from "../components/SwipeableRow";
import * as placesActions from "../store/places-actions";

const SwipeableRow = ({ item, navigation, onDelete }) => {
  return (
    <SwipeableRowComp onDelete={onDelete}>
      <PlaceItem
        image={item.imageUri}
        title={item.title}
        address={item.address}
        onSelect={() => {
          navigation.navigate("PlaceDetail", {
            placeTitle: item.title,
            placeId: item.id,
          });
        }}
      />
    </SwipeableRowComp>
  );
};

const PlacesListScreen = (props) => {
  const places = useSelector((state) => state.places.places);
  const dispatch = useDispatch();
  //console.log(places);

  useEffect(() => {
    dispatch(placesActions.loadPlaces());
  }, [dispatch]);

  const onDelete = (id, imageUrl) => {
    dispatch(placesActions.removePlace(id, imageUrl));
  };

  return (
    <FlatList
      data={places}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <SwipeableRow
          item={item}
          navigation={props.navigation}
          onDelete={() => onDelete(item.id, item.imageUri)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

PlacesListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Places",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Place"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
          onPress={() => {
            navData.navigation.navigate("NewPlace");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "rgb(200, 199, 204)",
    height: StyleSheet.hairlineWidth,
  },
});

export default PlacesListScreen;
