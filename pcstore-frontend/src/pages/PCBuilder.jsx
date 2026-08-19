import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCpu,
  FiHardDrive
} from 'react-icons/fi';

// ============================================
// CONFIGURATION
// ============================================

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
const getImageUrl = (img) => {
  const url = img?.url ?? img;
  if (!url) return 'https://via.placeholder.com/80';
  return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
};

const COLORS = {
  primary: '#7C3AED',
  secondary: '#EC4899',
  accent1: '#3B82F6',
  accent2: '#10B981',
  accent3: '#F59E0B',
};

const STEPS = [
  { id: 'motherboard', label: 'Motherboard', category: 'MOTHERBOARD' },
  { id: 'cpu', label: 'CPU', category: 'CPU' },
  { id: 'gpu', label: 'GPU', category: 'GPU' },
  { id: 'ram', label: 'RAM', category: 'RAM' },
  { id: 'psu', label: 'PSU', category: 'PSU' },
  { id: 'case', label: 'Case', category: 'CASE' },
  { id: 'cooling', label: 'Cooling', category: 'COOLING' },
  { id: 'storage', label: 'Storage', category: null },
  { id: 'review', label: 'Review', category: null },
];

// ============================================
// HELPER COMPONENTS
// ============================================

const BackButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${disabled
      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
      : 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400'
      }`}
  >
    <FiArrowLeft /> Back
  </button>
);

const NextButton = ({ onClick, label = "Next Step", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${disabled
      ? 'bg-neutral-300 text-white cursor-not-allowed'
      : 'bg-neutral-900 text-white hover:bg-neutral-800'
      }`}
  >
    {label} <FiArrowRight />
  </button>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-4 animate-pulse border border-neutral-100">
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-neutral-100 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-5 bg-neutral-100 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-100 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-neutral-100 rounded w-1/3"></div>
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <div className="h-6 bg-neutral-100 rounded w-24"></div>
      <div className="h-9 bg-neutral-100 rounded-lg w-28"></div>
    </div>
  </div>
);

const LowStockIndicator = ({ stock }) => (
  <div className="flex items-center gap-1 mt-1">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
    </span>
    <span className="text-xs text-orange-600 font-medium">Only {stock} left</span>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const PCBuilder = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [isBuilt, setIsBuilt] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [selections, setSelections] = useState({
    motherboard: null, cpu: null, gpu: null, ram: null,
    psu: null, case: null, cooling: null,
    primaryStorage: null,
    secondaryStorage: []
  });

  // Queries
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productService.getAllProducts()
  });

  // Effects
  useEffect(() => {
    checkCompatibility();
  }, [selections]);

  // Helper Functions
  const getProductsByCategory = (category) => {
    if (category === 'COOLING') {
      return allProducts?.filter(p => ['COOLING_CPU_AIR', 'COOLING_CPU_LIQUID', 'COOLING_FAN'].includes(p.category)) || [];
    }
    return allProducts?.filter(p => p.category === category) || [];
  };

  const getPrimaryStorageOptions = () => {
    return allProducts?.filter(p => p.category === 'STORAGE_NVME') || [];
  };

  const getSecondaryStorageOptions = (type) => {
    if (type === 'SATA') {
      return allProducts?.filter(p => p.category === 'STORAGE_SATA') || [];
    }
    if (type === 'HDD') {
      return allProducts?.filter(p => p.category === 'STORAGE_HDD') || [];
    }
    return [];
  };

  const handleSelect = (category, product) => {
    setSelections(prev => ({ ...prev, [category]: product }));
    toast.success(`${product.name} selected for your build!`);
  };

  const handleAddToCartOnly = async (product) => {
    await addToCart(product.id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddSecondaryStorage = async (product) => {
    if (selections.secondaryStorage.some(item => item.id === product.id)) {
      toast.error('Storage already added');
      return;
    }

    setSelections(prev => ({
      ...prev,
      secondaryStorage: [...prev.secondaryStorage, product]
    }));
    toast.success(`${product.name} added as secondary storage!`);
  };

  const handleRemoveSecondaryStorage = async (productId) => {
    setSelections(prev => ({
      ...prev,
      secondaryStorage: prev.secondaryStorage.filter(item => item.id !== productId)
    }));
    toast.success('Storage removed');
  };

  const checkCompatibility = async () => {
    const componentIds = [
      selections.motherboard?.id,
      selections.cpu?.id,
      selections.gpu?.id,
      selections.ram?.id,
      selections.psu?.id,
      selections.case?.id,
      selections.cooling?.id,
      selections.primaryStorage?.id,
      ...selections.secondaryStorage.map(s => s.id)
    ].filter(Boolean);

    if (componentIds.length >= 2) {
      try {
        const result = await productService.checkCompatibility(componentIds);
        setCompatibilityResult(result);
      } catch (error) {
        console.error('Compatibility check failed:', error);
      }
    }
  };

  const buildPC = async () => {
    const components = [
      selections.motherboard,
      selections.cpu,
      selections.gpu,
      selections.ram,
      selections.psu,
      selections.case,
      selections.cooling,
      selections.primaryStorage,
      ...selections.secondaryStorage
    ].filter(c => c?.id);

    for (const component of components) {
      await addToCart(component.id, 1);
    }
    setIsBuilt(true);
    toast.success('All components added to cart!');
  };

  const calculateTotalPrice = () => {
    const primaryTotal = Object.values(selections)
      .filter(c => c?.price && typeof c === 'object')
      .reduce((total, c) => total + (c.price || 0), 0);

    const secondaryTotal = selections.secondaryStorage
      .reduce((total, c) => total + (c.price || 0), 0);

    return primaryTotal + secondaryTotal;
  };

  const handleNext = () => {
    if (activeStep === STEPS.findIndex(s => s.id === 'storage')) {
      if (!selections.primaryStorage) {
        toast.error('Please select a primary NVMe SSD first');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const selectedCount = () => {
    let count = Object.values(selections).filter(c => c?.id && typeof c === 'object').length;
    count += selections.secondaryStorage.length;
    return count;
  };

  const totalPrice = calculateTotalPrice();
  const currentStep = STEPS[activeStep];
  const isReviewStep = activeStep === STEPS.length - 1;
  const hasRequiredComponents = selections.motherboard && selections.cpu &&
    selections.gpu && selections.ram && selections.psu &&
    selections.case && selections.cooling && selections.primaryStorage;

  // Product Row Component - With View Product link
  const ProductRow = ({ item, category, isSelected, onSelect, showAddButton = false, onAdd }) => {
    const lowStock = item.stockQuantity < 10 && item.stockQuantity > 0;
    const imageUrl = item.images?.[0] ? getImageUrl(item.images[0]) : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: '#fafafa' }}
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-all ${isSelected
          ? 'bg-purple-50 border-l-4 border-purple-600'
          : 'bg-white border border-neutral-200'
          }`}
      >
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Clickable Image - Navigate to Product */}
          <Link
            to={`/product/${item.id}`}
            className="flex-shrink-0 cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={item.name}
                className="w-16 h-16 object-contain rounded-lg bg-neutral-50 p-2 hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
            )}
          </Link>

          {/* Clickable Name - Navigate to Product */}
          <div className="flex-1">
            <Link
              to={`/product/${item.id}`}
              className="font-semibold text-neutral-900 hover:text-purple-600 transition-colors cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
            </Link>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-neutral-500">
              {item.socket && <span>Socket: {item.socket}</span>}
              {item.cores && <span>{item.cores} Cores</span>}
              {item.ramType && <span>{item.ramType}</span>}
              {item.wattage && <span>{item.wattage}W</span>}
              {item.capacity && <span>{item.capacity}GB</span>}
              {item.speed && <span>{item.speed}MHz</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <div className="text-right">
            <div className="text-lg font-bold text-neutral-900">
              ₹{item.price?.toLocaleString()}
            </div>
            {lowStock && <LowStockIndicator stock={item.stockQuantity} />}
          </div>

          {/* Single Action Button - Select for Build (adds to cart + selects) */}
          <button
            onClick={() => showAddButton ? onAdd() : onSelect()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm cursor-pointer ${isSelected
              ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              : showAddButton
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
          >
            <FiShoppingCart />
            {isSelected ? 'Selected' : showAddButton ? 'Add to Build' : 'Select for Build'}
          </button>
        </div>
      </motion.div>
    );
  };

  // Render Storage Step
  const renderStorageStep = () => {
    const primaryOptions = getPrimaryStorageOptions();
    const isLoadingProducts = isLoading;

    if (isLoadingProducts) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
            <FiHardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Choose Your Storage
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">Select primary NVMe SSD (required) and optional secondary drives</p>
          </div>
        </div>

        {/* Primary Storage */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">REQUIRED</span>
            <h3 className="text-lg font-semibold text-neutral-900">Primary Boot Drive - NVMe SSD</h3>
          </div>
          <p className="text-sm text-neutral-500 mb-4">High-speed NVMe SSD for OS and frequently used applications</p>

          {!selections.primaryStorage && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">⚠️ You must select a primary NVMe SSD to continue</p>
            </div>
          )}

          <div className="space-y-3">
            {primaryOptions.map((product) => (
              <ProductRow
                key={product.id}
                item={product}
                isSelected={selections.primaryStorage?.id === product.id}
                onSelect={() => handleSelect('primaryStorage', product)}
              />
            ))}
          </div>
        </div>

        {/* Secondary Storage */}
        <div className="border-t border-neutral-200 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">OPTIONAL</span>
            <h3 className="text-lg font-semibold text-neutral-900">Secondary Storage</h3>
          </div>
          <p className="text-sm text-neutral-500 mb-4">Add SATA SSDs or HDDs for additional storage (can add multiple)</p>

          {selections.secondaryStorage.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Selected Secondary Drives:</h4>
              <div className="space-y-2">
                {selections.secondaryStorage.map((drive) => (
                  <div key={drive.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-3">
                      {drive.images?.[0] && (
                        <img src={getImageUrl(drive.images[0])} alt={drive.name} className="w-10 h-10 object-contain" />
                      )}
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">{drive.name}</p>
                        <p className="text-xs text-neutral-500">{drive.capacity}GB • {drive.category?.replace('STORAGE_', '')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-neutral-900">₹{drive.price?.toLocaleString()}</span>
                      <button
                        onClick={() => handleRemoveSecondaryStorage(drive.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* SATA SSD Option */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    const sataDrives = getSecondaryStorageOptions('SATA');
                    if (sataDrives.length === 0) {
                      toast.error('No SATA SSDs available');
                    }
                  }}
                  className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  Add SATA SSD
                </button>
                <span className="text-xs text-neutral-400">High speed, great for games</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getSecondaryStorageOptions('SATA').map((product) => (
                  <div key={product.id} className={`p-3 rounded-lg flex items-center justify-between transition-all ${selections.secondaryStorage.some(s => s.id === product.id)
                    ? 'bg-neutral-100 opacity-60'
                    : 'bg-white border border-neutral-200 hover:border-blue-300'
                    }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img src={getImageUrl(product.images[0])} alt={product.name} className="w-12 h-12 object-contain" />
                        )}
                        <div>
                          <p className="font-medium text-neutral-900 text-sm">{product.name}</p>
                          <p className="text-xs text-neutral-500">{product.capacity}GB SATA SSD</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-neutral-900">₹{product.price?.toLocaleString()}</span>
                      {!selections.secondaryStorage.some(s => s.id === product.id) ? (
                        <button
                          onClick={() => handleAddSecondaryStorage(product)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <FiPlus /> Add
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">Added ✓</span>
                      )}
                    </div>
                  </div>
                ))}
                {getSecondaryStorageOptions('SATA').length === 0 && (
                  <p className="text-center text-neutral-400 text-sm py-4">No SATA SSDs available</p>
                )}
              </div>
            </div>

            {/* HDD Option */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    const hddDrives = getSecondaryStorageOptions('HDD');
                    if (hddDrives.length === 0) {
                      toast.error('No HDDs available');
                    }
                  }}
                  className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                >
                  Add HDD
                </button>
                <span className="text-xs text-neutral-400">High capacity, budget friendly</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getSecondaryStorageOptions('HDD').map((product) => (
                  <div key={product.id} className={`p-3 rounded-lg flex items-center justify-between transition-all ${selections.secondaryStorage.some(s => s.id === product.id)
                    ? 'bg-neutral-100 opacity-60'
                    : 'bg-white border border-neutral-200 hover:border-purple-300'
                    }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img src={getImageUrl(product.images[0])} alt={product.name} className="w-12 h-12 object-contain" />
                        )}
                        <div>
                          <p className="font-medium text-neutral-900 text-sm">{product.name}</p>
                          <p className="text-xs text-neutral-500">{product.capacity}GB HDD</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-neutral-900">₹{product.price?.toLocaleString()}</span>
                      {!selections.secondaryStorage.some(s => s.id === product.id) ? (
                        <button
                          onClick={() => handleAddSecondaryStorage(product)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <FiPlus /> Add
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">Added ✓</span>
                      )}
                    </div>
                  </div>
                ))}
                {getSecondaryStorageOptions('HDD').length === 0 && (
                  <p className="text-center text-neutral-400 text-sm py-4">No HDDs available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render Category Step
  const renderCategoryStep = (step) => {
    const products = getProductsByCategory(step.category);
    const currentSelection = selections[step.id];
    const isLoadingProducts = isLoading && activeStep === 0;

    if (isLoadingProducts) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (!products.length) {
      return <div className="text-center py-16 text-neutral-500">No products available</div>;
    }

    return (
      <>
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
            <FiCpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Choose Your {step.label}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">Select the perfect component for your build</p>
          </div>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              item={product}
              category={step.id}
              isSelected={currentSelection?.id === product.id}
              onSelect={() => handleSelect(step.id, product)}
            />
          ))}
        </div>
      </>
    );
  };

  const renderReviewStep = () => {
    const componentList = [
      { label: 'Motherboard', value: selections.motherboard, required: true },
      { label: 'CPU', value: selections.cpu, required: true },
      { label: 'GPU', value: selections.gpu, required: true },
      { label: 'RAM', value: selections.ram, required: true },
      { label: 'PSU', value: selections.psu, required: true },
      { label: 'Case', value: selections.case, required: true },
      { label: 'Cooling', value: selections.cooling, required: true },
      { label: 'Primary Storage (NVMe)', value: selections.primaryStorage, required: true },
    ];

    const hasAllRequired = componentList.every(item => item.value);

    return (
      <div>
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
            <FiCpu className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">Review Your Build</h3>
        </div>

        <div className="bg-neutral-50 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {componentList.map((item) => (
              <div
                key={item.label}
                className={`p-3 rounded-lg flex items-center gap-3 ${item.value ? 'bg-white border border-neutral-200' : 'bg-neutral-100'}`}
              >
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 mb-0.5">
                    {item.label}
                    {item.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {item.value ? (
                    <Link
                      to={`/product/${item.value.id}`}
                      className="font-medium text-sm text-neutral-900 hover:text-purple-600 transition-colors cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.value.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-sm text-neutral-400">Not selected</p>
                  )}
                </div>
                {item.value && (
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">₹{item.value.price?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Secondary Storage Section */}
            <div className="md:col-span-2">
              <div className="p-3 rounded-lg bg-white border border-neutral-200">
                <p className="text-xs text-neutral-500 mb-2">Secondary Storage <span className="text-green-600 ml-1">(Optional)</span></p>

                {selections.secondaryStorage.length > 0 ? (
                  <div className="space-y-2">
                    {selections.secondaryStorage.map((drive) => (
                      <div key={drive.id} className="flex justify-between items-center py-2 border-t border-neutral-100">
                        <Link
                          to={`/product/${drive.id}`}
                          className="text-sm text-neutral-700 hover:text-purple-600 transition-colors cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {drive.name}
                        </Link>
                        <span className="font-semibold text-neutral-900">₹{drive.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 italic">No secondary storage selected</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap justify-between items-center gap-3">
            <span className="font-semibold text-neutral-600">Total Price:</span>
            <span className="text-2xl font-bold text-neutral-900">₹{totalPrice.toLocaleString()}</span>
          </div>

          {compatibilityResult && (
            <div className={`mt-4 p-4 rounded-lg ${compatibilityResult.compatible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${compatibilityResult.compatible ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {compatibilityResult.compatible ? '✓' : '!'}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Compatibility Check</h4>
                  {compatibilityResult.issues?.map((issue, i) => <p key={i} className="text-red-600 text-xs">• {issue}</p>)}
                  {compatibilityResult.warnings?.map((warning, i) => <p key={i} className="text-yellow-600 text-xs">⚠ {warning}</p>)}
                  {compatibilityResult.compatible && !compatibilityResult.issues?.length && (
                    <p className="text-green-600 text-sm font-medium">✓ All components are compatible!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <button onClick={buildPC} disabled={!hasAllRequired}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${hasAllRequired ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-neutral-300 cursor-not-allowed'}`}>
              <FiShoppingCart /> Build My PC - ₹{totalPrice.toLocaleString()}
            </button>
            {!hasAllRequired && <p className="text-center text-xs text-neutral-500 mt-2">Please select all required components (*) to continue</p>}
          </div>
        </div>

        <div className="mt-5">
          <BackButton onClick={handleBack} disabled={false} />
        </div>
      </div>
    );
  };

  // Floating Price Bar
  const FloatingPriceBar = () => {
    if (isReviewStep || selectedCount() === 0) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <FiCpu className="w-4 h-4" />
                </div>
                <span className="font-medium text-neutral-700 text-sm">
                  {selectedCount()} component{selectedCount() !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="h-6 w-px bg-neutral-300 hidden sm:block"></div>
              <div className="text-xl font-bold text-neutral-900">₹{totalPrice.toLocaleString()}</div>
            </div>
            <button onClick={() => setActiveStep(STEPS.length - 1)}
              className="w-full sm:w-auto px-5 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 text-sm">
              View Build <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Build Complete Screen
  if (isBuilt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Build Complete! 🎉
          </h2>
          <p className="text-neutral-500 text-sm mb-2">Your dream PC has been configured</p>
          <p className="text-xl font-bold text-neutral-900 mb-6">₹{totalPrice.toLocaleString()}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => window.location.reload()} className="flex-1 px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition">
              Start New Build
            </button>
            <button onClick={() => window.location.href = '/cart'} className="flex-1 px-5 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition">
              Go to Cart →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-white pb-24">

      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-20 mb-8 border-b border-purple-500/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 tracking-wider uppercase">
            🛠️ Adaptive Compatibility Matrix
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Forge Your Ultimate Battle Station
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Handpick elite tier hardware while our hardware kernel analyzes bottlenecks, dimensions, power guidelines, and logic requirements in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Stepper */}
        <div className="hidden md:block mb-10">
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200">
              <div className="h-full bg-neutral-900 transition-all duration-300" style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }} />
            </div>
            <div className="relative flex justify-between">
              {STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                return (
                  <div key={step.label} className="flex flex-col items-center">
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-neutral-900 text-white'
                      : isActive ? 'bg-white text-neutral-900 border-2 border-neutral-900'
                        : 'bg-neutral-200 text-neutral-500'
                      }`}>
                      {isCompleted ? <FiCheck /> : <FiCpu className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="md:hidden mb-6">
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-neutral-500">Step {activeStep + 1} of {STEPS.length}</span>
            <p className="text-base font-semibold text-neutral-900 mt-1">{currentStep?.label}</p>
          </div>
          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 rounded-full transition-all duration-300" style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <div key={activeStep}>
            {isReviewStep
              ? renderReviewStep()
              : currentStep?.id === 'storage'
                ? renderStorageStep()
                : renderCategoryStep(currentStep)}
          </div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!isReviewStep && (
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-8">
            <BackButton onClick={handleBack} disabled={activeStep === 0} />
            <NextButton
              onClick={handleNext}
              disabled={currentStep?.id === 'storage' && !selections.primaryStorage}
            />
          </div>
        )}
      </div>

      <FloatingPriceBar />
    </div>
  );
};

export default PCBuilder;