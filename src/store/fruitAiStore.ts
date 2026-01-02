import { create } from "zustand";
import {
  createRandomFruitEmbeddings,
  trainOnce,
  type Vec2,
} from "../utils/logic";

type FruitEmbeddings = Record<string, Vec2>;

type FruitAiState = {
  fruitEmbeddings: FruitEmbeddings;
  isTraining: boolean;

  initRandom: () => void;
  setIsTraining: (value: boolean) => void;
  trainStep: (lr?: number) => void;
  resetTraining: () => void;
};

export const useFruitAiStore = create<FruitAiState>((set, _get) => ({
  fruitEmbeddings: {
    apple: [0, 0],
    strawberry: [0, 0],
    banana: [0, 0],
    kiwi: [0, 0],
  },
  isTraining: false,

  initRandom: () => {
    set({ fruitEmbeddings: createRandomFruitEmbeddings() });
  },

  setIsTraining: (value) => {
    set({ isTraining: value });
  },

  trainStep: (lr = 0.1) => {
    set((state) => ({
      fruitEmbeddings: trainOnce(state.fruitEmbeddings, lr),
    }));
  },

  resetTraining: () => {
    set({
      isTraining: false,
      fruitEmbeddings: createRandomFruitEmbeddings(),
    });
  },
}));
