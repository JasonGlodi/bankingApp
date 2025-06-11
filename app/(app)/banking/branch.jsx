import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/header";
import Navbar from "../../components/Navbar";

const { width, height } = Dimensions.get("window");

// Replace with your actual Google Places API key
const GOOGLE_PLACES_API_KEY = "AIzaSyDCwWlVmNde3JhhanAtYGC1LhC-sTfnZ6w";

export default function BranchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapType, setMapType] = useState("standard");
  const [showMapTypeModal, setShowMapTypeModal] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const mapRef = useRef(null);

  const mapTypes = [
    { key: "standard", label: "Standard", icon: "map-outline" },
    { key: "satellite", label: "Satellite", icon: "globe-outline" },
    { key: "hybrid", label: "Hybrid", icon: "layers-outline" },
    { key: "terrain", label: "Terrain", icon: "mountain-outline" },
  ];

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is required to show nearby banks and provide accurate results."
        );
        setLoading(false);
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation(userCoords);

      // Search for nearby banks using Google Places API
      await searchNearbyBanks(
        location.coords.latitude,
        location.coords.longitude
      );

      setLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "Unable to get your location. Please check your GPS settings."
      );
      setLoading(false);
    }
  };

  // Search for banks using Google Places API
  const searchNearbyBanks = async (lat, lng, query = "") => {
    try {
      setSearchLoading(true);

      const radius = 5000; // 5km radius
      let url;

      if (query && query.trim() !== "") {
        // Text search for specific query
        url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query + " bank"
        )}&location=${lat},${lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;
      } else {
        // Nearby search for banks
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=bank&key=${GOOGLE_PLACES_API_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const bankData = await Promise.all(
          data.results.map(async (place) => {
            // Get additional details for each bank
            const details = await getBankDetails(place.place_id);
            return {
              id: place.place_id,
              name: place.name,
              address: place.formatted_address || place.vicinity,
              rating: place.rating || 0,
              isOpen: place.opening_hours?.open_now || false,
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
              photos: place.photos,
              types: place.types,
              priceLevel: place.price_level,
              ...details,
            };
          })
        );

        setBanks(bankData);
      } else if (data.status === "ZERO_RESULTS") {
        setBanks([]);
        Alert.alert(
          "No Results",
          "No banks found in this area. Try expanding your search area."
        );
      } else {
        console.error("Places API error:", data.status, data.error_message);
        Alert.alert(
          "Error",
          `Unable to fetch bank information: ${
            data.error_message || data.status
          }`
        );
      }

      setSearchLoading(false);
    } catch (error) {
      console.error("Error searching banks:", error);
      Alert.alert(
        "Error",
        "Network error while searching for banks. Please check your internet connection."
      );
      setSearchLoading(false);
    }
  };

  // Get detailed bank information
  const getBankDetails = async (placeId) => {
    try {
      const fields =
        "formatted_phone_number,website,opening_hours,rating,reviews,url,international_phone_number";

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        return {
          phone:
            data.result.formatted_phone_number ||
            data.result.international_phone_number,
          website: data.result.website,
          hours: data.result.opening_hours?.weekday_text || [],
          googleUrl: data.result.url,
          reviews: data.result.reviews || [],
        };
      }
      return {};
    } catch (error) {
      console.error("Error getting bank details:", error);
      return {};
    }
  };

  // Handle search input
  const handleSearch = async () => {
    if (!userLocation) {
      Alert.alert(
        "Location Required",
        "Please enable location services to search for banks."
      );
      return;
    }

    Keyboard.dismiss();
    await searchNearbyBanks(
      userLocation.latitude,
      userLocation.longitude,
      searchQuery.trim()
    );
  };

  // Clear search and show all nearby banks
  const clearSearch = async () => {
    setSearchQuery("");
    Keyboard.dismiss();
    if (userLocation) {
      await searchNearbyBanks(userLocation.latitude, userLocation.longitude);
    }
  };

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle marker press
  const handleMarkerPress = (bank) => {
    setSelectedBank(bank);
    // Animate to the selected bank
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: bank.latitude,
          longitude: bank.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  // Handle phone call
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
      Linking.openURL(`tel:${cleanNumber}`);
    } else {
      Alert.alert(
        "No Phone Number",
        "Phone number not available for this bank."
      );
    }
  };

  // Handle website visit
  const handleWebsite = (website) => {
    if (website) {
      const url = website.startsWith("http") ? website : `https://${website}`;
      Linking.openURL(url);
    } else {
      Alert.alert("No Website", "Website not available for this bank.");
    }
  };

  // Handle directions
  const handleDirections = (bank) => {
    if (bank.googleUrl) {
      Linking.openURL(bank.googleUrl);
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}`;
      Linking.openURL(url);
    }
  };

  // Handle map type change
  const handleMapTypeChange = (newMapType) => {
    setMapType(newMapType);
    setShowMapTypeModal(false);
  };

  // Render map type selector modal
  const renderMapTypeModal = () => (
    <Modal
      visible={showMapTypeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMapTypeModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowMapTypeModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Map Type</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowMapTypeModal(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {mapTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.mapTypeOption,
                    mapType === type.key && styles.selectedMapType,
                  ]}
                  onPress={() => handleMapTypeChange(type.key)}
                >
                  <Ionicons
                    name={type.icon}
                    size={24}
                    color={mapType === type.key ? "#007AFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.mapTypeLabel,
                      mapType === type.key && styles.selectedMapTypeLabel,
                    ]}
                  >
                    {type.label}
                  </Text>
                  {mapType === type.key && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Render bank information card
  const renderBankInfo = () => {
    if (!selectedBank) return null;

    return (
      <View style={styles.bankInfoCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bankInfoHeader}>
            <Text style={styles.bankName}>{selectedBank.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedBank(null)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.bankAddress}>{selectedBank.address}</Text>

          <View style={styles.ratingContainer}>
            {selectedBank.rating > 0 && (
              <>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>
                  {selectedBank.rating.toFixed(1)}
                </Text>
              </>
            )}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>• </Text>
              <Text
                style={[
                  styles.statusText,
                  { color: selectedBank.isOpen ? "#4CAF50" : "#F44336" },
                ]}
              >
                {selectedBank.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {selectedBank.phone && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(selectedBank.phone)}
              >
                <Ionicons name="call" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDirections(selectedBank)}
            >
              <Ionicons name="navigate" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>

            {selectedBank.website && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleWebsite(selectedBank.website)}
              >
                <Ionicons name="globe" size={20} color="#007AFF" />
                <Text style={styles.actionButtonText}>Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Contact Info */}
          {(selectedBank.phone || selectedBank.website) && (
            <View style={styles.contactInfo}>
              {selectedBank.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={16} color="#666" />
                  <Text style={styles.infoText}>{selectedBank.phone}</Text>
                </View>
              )}

              {selectedBank.website && (
                <View style={styles.infoRow}>
                  <Ionicons name="globe" size={16} color="#666" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {selectedBank.website.replace(/^https?:\/\//, "")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Opening Hours */}
          {selectedBank.hours && selectedBank.hours.length > 0 && (
            <View style={styles.hoursContainer}>
              <Text style={styles.hoursTitle}>Opening Hours:</Text>
              {selectedBank.hours.map((hours, index) => (
                <Text key={index} style={styles.hoursText}>
                  {hours}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Header title="Branch Locator" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding nearby banks...</Text>
        </View>
        <Navbar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Branch Locator" showBack={true} />

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for specific banks..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                blurOnSubmit={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
              {searchLoading && (
                <ActivityIndicator
                  size="small"
                  color="#007AFF"
                  style={styles.searchLoader}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Map */}
          <View style={styles.mapContainer}>
            {userLocation && (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={userLocation}
                mapType={mapType}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                loadingEnabled={true}
                onPress={dismissKeyboard}
              >
                {banks.map((bank) => (
                  <Marker
                    key={bank.id}
                    coordinate={{
                      latitude: bank.latitude,
                      longitude: bank.longitude,
                    }}
                    title={bank.name}
                    description={bank.address}
                    onPress={() => handleMarkerPress(bank)}
                  >
                    <View style={styles.markerContainer}>
                      <Ionicons name="business" size={24} color="#007AFF" />
                    </View>
                  </Marker>
                ))}
              </MapView>
            )}

            {/* Map Type Button */}
            <TouchableOpacity
              style={styles.mapTypeButton}
              onPress={() => setShowMapTypeModal(true)}
            >
              <Ionicons name="layers" size={24} color="#007AFF" />
            </TouchableOpacity>

            {/* Location Button */}
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <Ionicons name="locate" size={24} color="#007AFF" />
            </TouchableOpacity>

            {/* Bank Information Card */}
            {renderBankInfo()}
          </View>

          {/* Results Count */}
          {!searchLoading && !isKeyboardVisible && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>
                {banks.length} bank{banks.length !== 1 ? "s" : ""} found
              </Text>
            </View>
          )}

          {/* Map Type Modal */}
          {renderMapTypeModal()}
        </View>
      </TouchableWithoutFeedback>

      {!isKeyboardVisible && <Navbar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  searchLoader: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButton: {
    position: "absolute",
    bottom: 100,
    right: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  resultsText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: height * 0.5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    padding: 4,
  },
  mapTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMapType: {
    backgroundColor: "#f0f8ff",
  },
  mapTypeLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  selectedMapTypeLabel: {
    color: "#007AFF",
    fontWeight: "600",
  },
  bankInfoCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.5,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bankInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  bankAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    fontSize: 14,
    color: "#333",
    marginLeft: 4,
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e1e5e9",
  },
  actionButton: {
    alignItems: "center",
    padding: 8,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
    fontWeight: "500",
  },
  contactInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});
