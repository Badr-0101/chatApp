import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import styleReducer from './styleSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configure persistence for individual slices
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['id', 'email', 'access_token'], // Only persist these fields from auth
};

// Root persist configuration


// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  chat: chatReducer,
  style: styleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Configure store with middleware to handle persistence
export const setupStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  // Create the persistor
  const persistor = persistStore(store);

  return { store, persistor };
};

// Export store and persistor
export const { store: appStore, persistor: appPersistor } = setupStore();
export type AppDispatch = typeof appStore.dispatch;
