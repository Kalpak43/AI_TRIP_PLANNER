import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Itinerary {
  id?: string;
  title: string;
  info: {
    weather: string;
  };
  destination?: string;
  itinerary: {
    day: number;
    title: string;
    activities: {
      time: string;
      location: string;
      description: string;
      type: string;
    }[];
  }[];
  accommodation?: {
    budget: {
      name: string;
      location: string;
      amenities: string;
    };
    mid_range: {
      name: string;
      location: string;
      amenities: string;
    };
    luxury: {
      name: string;
      location: string;
      amenities: string;
    };
  };
  budget: {
    flights: string;
    accommodation: string;
    daily_expenses: string;
    total_budget: string;
  };
  createdBy?: string;
  creatorProfile?: string;
  createdAt?: Date;
}

const storeItinerary = async (
  userId: string,
  photoUrl: string,
  itinerary: Itinerary
) => {
  try {
    const itinerariesCollection = collection(
      db,
      "users",
      userId,
      "itineraries"
    );
    await addDoc(itinerariesCollection, {
      ...itinerary,
      createdAt: new Date(),
      createdBy: userId,
      creatorProfile: photoUrl,
    });
    console.log("Itinerary stored successfully!");
  } catch (error) {
    console.error("Error storing itinerary: ", error);
  }
};

export { storeItinerary };

const getItineraries = async (userId: string) => {
  try {
    const itinerariesCollection = collection(
      db,
      "users",
      userId,
      "itineraries"
    );
    const querySnapshot = await getDocs(itinerariesCollection);
    const itineraries: Itinerary[] = [];
    querySnapshot.forEach((doc) => {
      itineraries.push({
        id: doc.id,
        ...doc.data(),
      } as Itinerary);
    });

    // Sort itineraries from newest to oldest
    itineraries.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Default to a very old date
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime(); // Newest to oldest
    });

    return itineraries;
  } catch (error) {
    console.error("Error retrieving itineraries: ", error);
    return [];
  }
};

export { getItineraries };

const getItineraryById = async (userId: string, itineraryId: string) => {
  try {
    const itineraryDocRef = doc(
      db,
      "users",
      userId,
      "itineraries",
      itineraryId
    );
    const itineraryDoc = await getDoc(itineraryDocRef);

    if (itineraryDoc.exists()) {
      return { id: itineraryDoc.id, ...itineraryDoc.data() } as Itinerary;
    } else {
      console.log("No such itinerary found!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving itinerary: ", error);
    return null;
  }
};

export { getItineraryById };

const updateItineraryById = async (
  userId: string,
  itineraryId: string,
  updatedData: Partial<Itinerary>
) => {
  try {
    const itineraryDocRef = doc(
      db,
      "users",
      userId,
      "itineraries",
      itineraryId
    );
    await updateDoc(itineraryDocRef, updatedData);
    console.log("Itinerary updated successfully!");
  } catch (error) {
    console.error("Error updating itinerary: ", error);
  }
};

export { updateItineraryById };

const deleteItineraryById = async (userId: string, itineraryId: string) => {
  try {
    const itineraryDocRef = doc(
      db,
      "users",
      userId,
      "itineraries",
      itineraryId
    );
    await deleteDoc(itineraryDocRef);
    console.log("Itinerary deleted successfully!");
  } catch (error) {
    console.error("Error deleting itinerary: ", error);
  }
};

export { deleteItineraryById };
