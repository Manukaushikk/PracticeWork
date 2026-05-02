import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use these instead of plain useDispatch / useSelector
// They are typed so TypeScript gives you autocomplete
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
