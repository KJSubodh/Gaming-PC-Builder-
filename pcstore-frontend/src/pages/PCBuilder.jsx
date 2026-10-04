import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import {
  FiShoppingCart,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCpu,
  FiHardDrive,
  FiDownload,
  FiFileText,
  FiX
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

const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

// ✅ CPU comes BEFORE Motherboard and RAM
const STEPS = [
  { id: 'cpu', label: 'CPU', category: 'CPU' },
  { id: 'motherboard', label: 'Motherboard', category: 'MOTHERBOARD' },
  { id: 'ram', label: 'RAM', category: 'RAM' },
  { id: 'gpu', label: 'GPU', category: 'GPU' },
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
  const { addMultipleToCart } = useCart();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selections, setSelections] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    gpu: null,
    psu: null,
    case: null,
    cooling: null,
    primaryStorage: null,
    secondaryStorage: []
  });

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productService.getAllProducts()
  });

  useEffect(() => {
    checkCompatibility();
  }, [selections]);

  // ============================================
  // ✅ SOCKET-AWARE FILTERING
  // ============================================

  const getProductsByCategory = (category) => {
    const all = allProducts || [];

    // ---- CPU ----
    if (category === 'CPU') {
      return all.filter(p => p.category === 'CPU');
    }

    // ---- MOTHERBOARD: filter by selected CPU socket ----
    if (category === 'MOTHERBOARD') {
      const cpu = selections.cpu;
      if (!cpu?.socket) return [];
      return all.filter(p =>
        p.category === 'MOTHERBOARD' &&
        p.socket?.toUpperCase() === cpu.socket.toUpperCase()
      );
    }

    // ---- RAM: filter by CPU socket (AM4 → DDR4, AM5 → DDR5) or motherboard ramType ----
    if (category === 'RAM') {
      const cpu = selections.cpu;
      if (!cpu?.socket) return [];

      const socket = cpu.socket.toUpperCase();

      if (socket === 'AM4') {
        return all.filter(p => p.category === 'RAM' && p.ramType?.toUpperCase() === 'DDR4');
      }
      if (socket === 'AM5') {
        return all.filter(p => p.category === 'RAM' && p.ramType?.toUpperCase() === 'DDR5');
      }

      // Intel — use the selected motherboard's ramType
      const mobo = selections.motherboard;
      if (mobo?.ramType) {
        return all.filter(p =>
          p.category === 'RAM' &&
          p.ramType?.toUpperCase() === mobo.ramType.toUpperCase()
        );
      }
      return all.filter(p => p.category === 'RAM');
    }

    // ---- COOLING ----
    if (category === 'COOLING') {
      return all.filter(p =>
        ['COOLING_CPU_AIR', 'COOLING_CPU_LIQUID', 'COOLING_FAN'].includes(p.category)
      );
    }

    // ---- Default ----
    return all.filter(p => p.category === category);
  };

  // ============================================
  // SELECTION HANDLERS — Reset downstream on change
  // ============================================

  const handleSelect = (category, product) => {
    setSelections(prev => {
      const updated = { ...prev, [category]: product };

      // ✅ CPU changed → clear motherboard, RAM, cooling
      if (category === 'cpu' && prev.cpu?.id !== product.id) {
        updated.motherboard = null;
        updated.ram = null;
        updated.cooling = null;
      }

      // ✅ Motherboard changed → clear RAM
      if (category === 'motherboard' && prev.motherboard?.id !== product.id) {
        updated.ram = null;
      }

      return updated;
    });

    toast.success(`${product.name} selected!`);

    const currentIndex = STEPS.findIndex(s => s.id === category);
    if (currentIndex !== -1 && currentIndex < STEPS.length - 2) {
      setTimeout(() => {
        setActiveStep(currentIndex + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 350);
    }
  };

  const handleAddSecondaryStorage = (product) => {
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

  const handleRemoveSecondaryStorage = (productId) => {
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

    const uniqueIds = [...new Set(componentIds)];

    if (uniqueIds.length === 0) {
      toast.error('No components selected');
      return;
    }

    setIsBuilding(true);

    try {
      const success = await addMultipleToCart(uniqueIds);
      if (success) {
        setShowBuildModal(false);
        navigate('/cart');
      }
    } finally {
      setIsBuilding(false);
    }
  };

  const calculateTotalPrice = () => {
    const primaryTotal = Object.values(selections)
      .filter(c => c?.price && typeof c === 'object')
      .reduce((total, c) => total + (c.price || 0), 0);
    const secondaryTotal = selections.secondaryStorage
      .reduce((total, c) => total + (c.price || 0), 0);
    return primaryTotal + secondaryTotal;
  };

  const totalPrice = calculateTotalPrice();

  // ============================================
  // PDF GENERATION (unchanged from before)
  // ============================================
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('PC STORE', margin, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('Custom PC Build Configuration', margin, 28);

      const buildId = `BUILD-${Date.now().toString().slice(-8)}`;
      const buildDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Build ID: ${buildId}`, pageWidth - margin, 20, { align: 'right' });
      doc.text(`Date: ${buildDate}`, pageWidth - margin, 28, { align: 'right' });

      yPos = 55;

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Build Components', margin, yPos);
      yPos += 8;

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      const components = [
        { label: 'Processor (CPU)', value: selections.cpu },
        { label: 'Motherboard', value: selections.motherboard },
        { label: 'Memory (RAM)', value: selections.ram },
        { label: 'Graphics Card (GPU)', value: selections.gpu },
        { label: 'Power Supply (PSU)', value: selections.psu },
        { label: 'Case', value: selections.case },
        { label: 'Cooling', value: selections.cooling },
        { label: 'Primary Storage (NVMe)', value: selections.primaryStorage },
      ];

      const imageCache = {};
      for (const comp of components) {
        if (comp.value?.images?.[0]) {
          try {
            const imgUrl = getImageUrl(comp.value.images[0]);
            imageCache[comp.value.id] = await loadImageAsBase64(imgUrl);
          } catch (e) {
            console.warn('Failed to load image for', comp.label);
          }
        }
      }
      for (const drive of selections.secondaryStorage) {
        if (drive.images?.[0]) {
          try {
            const imgUrl = getImageUrl(drive.images[0]);
            imageCache[drive.id] = await loadImageAsBase64(imgUrl);
          } catch (e) {
            console.warn('Failed to load image for', drive.name);
          }
        }
      }

      for (const comp of components) {
        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = margin + 10;
        }

        const rowHeight = comp.value ? 28 : 18;

        if (comp.value && imageCache[comp.value.id]) {
          try {
            doc.addImage(imageCache[comp.value.id], 'JPEG', margin, yPos, 20, 20);
          } catch (e) {
            console.warn('Failed to add image to PDF');
          }
        }

        const textStartX = (comp.value && imageCache[comp.value.id]) ? margin + 24 : margin;

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text(comp.label.toUpperCase(), textStartX, yPos + 4);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);

        if (comp.value) {
          const nameLines = doc.splitTextToSize(comp.value.name, pageWidth - textStartX - margin - 40);
          doc.text(nameLines, textStartX, yPos + 10);

          doc.setFont('helvetica', 'bold');
          doc.text(`Rs. ${comp.value.price?.toLocaleString('en-IN')}`, pageWidth - margin, yPos + 10, { align: 'right' });
          yPos += rowHeight;
        } else {
          doc.setTextColor(148, 163, 184);
          doc.setFont('helvetica', 'italic');
          doc.text('Not selected', textStartX, yPos + 10);
          yPos += rowHeight;
        }

        doc.setDrawColor(241, 245, 249);
        doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
      }

      if (selections.secondaryStorage.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = margin + 10;
        }

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.text('SECONDARY STORAGE', margin, yPos);
        yPos += 8;

        selections.secondaryStorage.forEach((drive) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin + 10;
          }

          if (imageCache[drive.id]) {
            try {
              doc.addImage(imageCache[drive.id], 'JPEG', margin, yPos, 16, 16);
            } catch (e) {
              console.warn('Failed to add secondary image');
            }
          }

          const textStartX = imageCache[drive.id] ? margin + 20 : margin;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(10);
          const nameLines = doc.splitTextToSize(drive.name, pageWidth - textStartX - margin - 40);
          doc.text(nameLines, textStartX, yPos + 8);
          doc.setFont('helvetica', 'bold');
          doc.text(`Rs. ${drive.price?.toLocaleString('en-IN')}`, pageWidth - margin, yPos + 8, { align: 'right' });

          yPos += (imageCache[drive.id] ? 22 : 16);
        });
      }

      yPos += 5;
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin + 10;
      }

      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos, pageWidth - margin * 2, 20, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('TOTAL BUILD PRICE', margin + 5, yPos + 13);

      doc.setFontSize(14);
      doc.setTextColor(124, 58, 237);
      doc.text(`Rs. ${totalPrice.toLocaleString('en-IN')}`, pageWidth - margin - 5, yPos + 13, { align: 'right' });

      yPos += 30;

      if (compatibilityResult) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = margin + 10;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Compatibility Status', margin, yPos);
        yPos += 8;

        if (compatibilityResult.compatible) {
          doc.setFillColor(240, 253, 244);
          doc.rect(margin, yPos, pageWidth - margin * 2, 12, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(22, 163, 74);
          doc.text('All components are compatible!', margin + 5, yPos + 8);
          yPos += 18;
        } else {
          doc.setFillColor(254, 242, 242);
          doc.rect(margin, yPos, pageWidth - margin * 2, 12, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(220, 38, 38);
          doc.text('Compatibility issues detected', margin + 5, yPos + 8);
          yPos += 18;

          if (compatibilityResult.issues?.length) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(220, 38, 38);
            compatibilityResult.issues.forEach((issue) => {
              if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = margin + 10;
              }
              doc.text(`- ${issue}`, margin + 5, yPos);
              yPos += 5;
            });
          }
        }
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `PC Store - Custom Build Configuration | Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      doc.save(`${buildId}.pdf`);
      toast.success('Build PDF downloaded!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // ============================================
  // STEP NAVIGATION
  // ============================================

  const isStepCompleted = (stepId) => {
    if (stepId === 'storage') return !!selections.primaryStorage;
    if (stepId === 'review') return false;
    return !!selections[stepId];
  };

  const goToStep = (index) => {
    setActiveStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (activeStep === STEPS.findIndex(s => s.id === 'storage')) {
      if (!selections.primaryStorage) {
        toast.error('Please select a primary NVMe SSD first');
        return;
      }
    }
    setActiveStep(prev => Math.min(prev + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCount = () => {
    let count = Object.values(selections).filter(c => c?.id && typeof c === 'object').length;
    count += selections.secondaryStorage.length;
    return count;
  };

  const currentStep = STEPS[activeStep];
  const isReviewStep = activeStep === STEPS.length - 1;

  // ============================================
  // PRODUCT ROW
  // ============================================

  const ProductRow = ({ item, isSelected, onSelect, showAddButton = false, onAdd }) => {
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
          <Link to={`/product/${item.id}`} className="flex-shrink-0" target="_blank" rel="noopener noreferrer">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={item.name}
                className="w-16 h-16 object-contain rounded-lg bg-neutral-50 p-2 hover:scale-105 transition-transform"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
              />
            )}
          </Link>
          <div className="flex-1">
            <Link
              to={`/product/${item.id}`}
              className="font-semibold text-neutral-900 hover:text-purple-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
            </Link>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-neutral-500">
              {item.socket && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">Socket: {item.socket}</span>}
              {item.ramType && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">{item.ramType}</span>}
              {item.cores && <span>{item.cores} Cores</span>}
              {item.wattage && <span>{item.wattage}W</span>}
              {item.capacity && <span>{item.capacity}GB</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <div className="text-right">
            <div className="text-lg font-bold text-neutral-900">₹{item.price?.toLocaleString()}</div>
            {lowStock && <LowStockIndicator stock={item.stockQuantity} />}
          </div>
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

  // ============================================
  // RENDER STORAGE STEP
  // ============================================

  const renderStorageStep = () => {
    const primaryOptions = allProducts?.filter(p => p.category === 'STORAGE_NVME') || [];

    if (isLoading) {
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
            <h2 className="text-xl font-semibold text-neutral-900">Choose Your Storage</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Select primary NVMe SSD (required) and optional secondary drives</p>
          </div>
        </div>

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

        <div className="border-t border-neutral-200 pt-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">OPTIONAL</span>
            <h3 className="text-lg font-semibold text-neutral-900">Secondary Storage</h3>
          </div>
          <p className="text-sm text-neutral-500 mb-4">Add SATA SSDs or HDDs for additional storage</p>

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
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">Add SATA SSD</span>
                <span className="text-xs text-neutral-400">High speed, great for games</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(allProducts?.filter(p => p.category === 'STORAGE_SATA') || []).map((product) => (
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
                {(allProducts?.filter(p => p.category === 'STORAGE_SATA') || []).length === 0 && (
                  <p className="text-center text-neutral-400 text-sm py-4">No SATA SSDs available</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">Add HDD</span>
                <span className="text-xs text-neutral-400">High capacity, budget friendly</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(allProducts?.filter(p => p.category === 'STORAGE_HDD') || []).map((product) => (
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
                {(allProducts?.filter(p => p.category === 'STORAGE_HDD') || []).length === 0 && (
                  <p className="text-center text-neutral-400 text-sm py-4">No HDDs available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // ============================================
  // RENDER CATEGORY STEP — with socket-aware info banners
  // ============================================

  const renderCategoryStep = (step) => {
    const products = getProductsByCategory(step.category);
    const currentSelection = selections[step.id];

    if (isLoading && activeStep === 0) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      );
    }

    // ✅ Contextual empty state messages
    if (!products.length) {
      let message = 'No products available';
      let cta = null;

      if (step.id === 'motherboard' && !selections.cpu?.socket) {
        message = 'Please select a CPU first to see compatible motherboards';
        cta = { label: '← Select CPU', stepIndex: STEPS.findIndex(s => s.id === 'cpu') };
      } else if (step.id === 'motherboard' && selections.cpu?.socket) {
        message = `No ${selections.cpu.socket} motherboards available. Try a different CPU.`;
        cta = { label: '← Change CPU', stepIndex: STEPS.findIndex(s => s.id === 'cpu') };
      } else if (step.id === 'ram' && !selections.cpu?.socket) {
        message = 'Please select a CPU first to see compatible RAM';
        cta = { label: '← Select CPU', stepIndex: STEPS.findIndex(s => s.id === 'cpu') };
      } else if (step.id === 'ram' && selections.cpu?.socket) {
        const ramType = selections.cpu.socket === 'AM4' ? 'DDR4'
          : selections.cpu.socket === 'AM5' ? 'DDR5'
            : (selections.motherboard?.ramType || 'compatible');
        message = `No ${ramType} RAM available for your ${selections.cpu.socket} platform.`;
        cta = { label: '← Change CPU', stepIndex: STEPS.findIndex(s => s.id === 'cpu') };
      }

      return (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-4">{message}</p>
          {cta && (
            <button
              onClick={() => goToStep(cta.stepIndex)}
              className="text-sm text-purple-600 hover:underline cursor-pointer"
            >
              {cta.label}
            </button>
          )}
        </div>
      );
    }

    // ✅ Socket context banner
    const socketBanner = () => {
      if (step.id === 'motherboard' && selections.cpu) {
        return (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-2">
            <span className="text-purple-600">🔧</span>
            <p className="text-sm text-purple-900">
              Showing only <strong>{selections.cpu.socket}</strong> motherboards compatible with your CPU <strong>{selections.cpu.name}</strong>
            </p>
          </div>
        );
      }
      if (step.id === 'ram' && selections.cpu) {
        const ramType = selections.cpu.socket === 'AM4' ? 'DDR4'
          : selections.cpu.socket === 'AM5' ? 'DDR5'
            : (selections.motherboard?.ramType || 'compatible');
        return (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-2">
            <span className="text-purple-600">🔧</span>
            <p className="text-sm text-purple-900">
              Showing only <strong>{ramType}</strong> RAM for <strong>{selections.cpu.socket}</strong> platform
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <>
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-neutral-200">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 text-neutral-600">
            <FiCpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Choose Your {step.label}</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Select the perfect component for your build</p>
          </div>
        </div>

        {socketBanner()}

        <div className="space-y-3">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              item={product}
              isSelected={currentSelection?.id === product.id}
              onSelect={() => handleSelect(step.id, product)}
            />
          ))}
        </div>
      </>
    );
  };

  // ============================================
  // RENDER REVIEW STEP
  // ============================================

  const renderReviewStep = () => {
    const componentList = [
      { label: 'CPU', value: selections.cpu, required: true, stepIndex: STEPS.findIndex(s => s.id === 'cpu') },
      { label: 'Motherboard', value: selections.motherboard, required: true, stepIndex: STEPS.findIndex(s => s.id === 'motherboard') },
      { label: 'RAM', value: selections.ram, required: true, stepIndex: STEPS.findIndex(s => s.id === 'ram') },
      { label: 'GPU', value: selections.gpu, required: true, stepIndex: STEPS.findIndex(s => s.id === 'gpu') },
      { label: 'PSU', value: selections.psu, required: true, stepIndex: STEPS.findIndex(s => s.id === 'psu') },
      { label: 'Case', value: selections.case, required: true, stepIndex: STEPS.findIndex(s => s.id === 'case') },
      { label: 'Cooling', value: selections.cooling, required: true, stepIndex: STEPS.findIndex(s => s.id === 'cooling') },
      { label: 'Primary Storage (NVMe)', value: selections.primaryStorage, required: true, stepIndex: STEPS.findIndex(s => s.id === 'storage') },
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
              <button
                key={item.label}
                onClick={() => goToStep(item.stepIndex)}
                className={`p-3 rounded-lg flex items-center gap-3 text-left transition-all cursor-pointer hover:shadow-md ${item.value ? 'bg-white border border-neutral-200 hover:border-purple-400' : 'bg-neutral-100 hover:bg-neutral-200 border border-transparent'}`}
              >
                {item.value?.images?.[0] && (
                  <div className="w-12 h-12 rounded-lg bg-neutral-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={getImageUrl(item.value.images[0])}
                      alt={item.value.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                {!item.value?.images?.[0] && (
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                    <FiCpu className="w-5 h-5 text-neutral-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 mb-0.5">
                    {item.label}{item.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {item.value ? (
                    <p className="font-medium text-sm text-neutral-900 truncate">{item.value.name}</p>
                  ) : (
                    <p className="font-medium text-sm text-neutral-400">Click to select</p>
                  )}
                </div>
                {item.value && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-neutral-900 text-sm">₹{item.value.price?.toLocaleString()}</p>
                  </div>
                )}
              </button>
            ))}

            <button
              onClick={() => goToStep(STEPS.findIndex(s => s.id === 'storage'))}
              className="md:col-span-2 p-3 rounded-lg bg-white border border-neutral-200 hover:border-purple-400 text-left transition-all cursor-pointer hover:shadow-md"
            >
              <p className="text-xs text-neutral-500 mb-2">Secondary Storage <span className="text-green-600 ml-1">(Optional)</span> - Click to edit</p>
              {selections.secondaryStorage.length > 0 ? (
                <div className="space-y-2">
                  {selections.secondaryStorage.map((drive) => (
                    <div key={drive.id} className="flex justify-between items-center py-2 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        {drive.images?.[0] && (
                          <img src={getImageUrl(drive.images[0])} alt={drive.name} className="w-8 h-8 object-contain" />
                        )}
                        <span className="text-sm text-neutral-700">{drive.name}</span>
                      </div>
                      <span className="font-semibold text-neutral-900 text-sm">₹{drive.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 italic">No secondary storage selected</p>
              )}
            </button>
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

          <div className="mt-4">
            <button
              onClick={() => setShowBuildModal(true)}
              disabled={!hasAllRequired}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${hasAllRequired ? 'bg-neutral-900 hover:bg-neutral-800' : 'bg-neutral-300 cursor-not-allowed'}`}
            >
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

  // ============================================
  // FLOATING PRICE BAR
  // ============================================

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
            <button onClick={() => goToStep(STEPS.length - 1)}
              className="w-full sm:w-auto px-5 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
              View Build <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-white pb-24">
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
                const isCompleted = isStepCompleted(step.id);
                const isPast = index < activeStep;

                return (
                  <button
                    key={step.label}
                    onClick={() => goToStep(index)}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${isActive
                      ? 'bg-white text-neutral-900 border-2 border-neutral-900 shadow-md'
                      : isCompleted
                        ? 'bg-neutral-900 text-white group-hover:bg-purple-600'
                        : isPast
                          ? 'bg-neutral-900 text-white group-hover:bg-purple-600'
                          : 'bg-neutral-200 text-neutral-500 group-hover:bg-neutral-300'
                      }`}>
                      {isCompleted && !isActive ? <FiCheck /> : <FiCpu className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium transition-colors ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-500 group-hover:text-neutral-900'
                      }`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="md:hidden mb-6">
          <div className="text-center mb-3">
            <span className="text-xs font-medium text-neutral-500">Step {activeStep + 1} of {STEPS.length}</span>
            <p className="text-base font-semibold text-neutral-900 mt-1">{currentStep?.label}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4">
            {STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = isStepCompleted(step.id);
              return (
                <button
                  key={step.label}
                  onClick={() => goToStep(index)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${isActive
                    ? 'bg-neutral-900 text-white'
                    : isCompleted
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                    }`}
                >
                  {isCompleted && !isActive && <FiCheck className="w-3 h-3" />}
                  {step.label}
                </button>
              );
            })}
          </div>
          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-neutral-900 rounded-full transition-all duration-300" style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {isReviewStep
              ? renderReviewStep()
              : currentStep?.id === 'storage'
                ? renderStorageStep()
                : renderCategoryStep(currentStep)}
          </motion.div>
        </AnimatePresence>

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

      {/* BUILD SUMMARY MODAL */}
      <AnimatePresence>
        {showBuildModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => !isGeneratingPDF && !isBuilding && setShowBuildModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Confirm Your Build</h3>
                    <p className="text-xs text-neutral-500">Review and download before adding to cart</p>
                  </div>
                </div>
                <button
                  onClick={() => !isGeneratingPDF && !isBuilding && setShowBuildModal(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[55vh]">
                <div className="bg-slate-950 rounded-lg p-4 mb-6 text-white">
                  <h4 className="text-xl font-bold mb-1">PC STORE</h4>
                  <p className="text-xs text-slate-400">Custom PC Build Configuration</p>
                </div>

                <h4 className="font-semibold text-neutral-900 mb-3">Build Components</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Processor (CPU)', value: selections.cpu },
                    { label: 'Motherboard', value: selections.motherboard },
                    { label: 'Memory (RAM)', value: selections.ram },
                    { label: 'Graphics Card (GPU)', value: selections.gpu },
                    { label: 'Power Supply (PSU)', value: selections.psu },
                    { label: 'Case', value: selections.case },
                    { label: 'Cooling', value: selections.cooling },
                    { label: 'Primary Storage (NVMe)', value: selections.primaryStorage },
                  ].map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2 border-b border-neutral-100">
                      {comp.value?.images?.[0] ? (
                        <div className="w-14 h-14 rounded-lg bg-neutral-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={getImageUrl(comp.value.images[0])}
                            alt={comp.value.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                          <FiCpu className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500">{comp.label}</p>
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {comp.value?.name || 'Not selected'}
                        </p>
                      </div>
                      {comp.value && (
                        <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                          ₹{comp.value.price?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}

                  {selections.secondaryStorage.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-neutral-500 mb-2 font-semibold uppercase">Secondary Storage</p>
                      {selections.secondaryStorage.map((drive) => (
                        <div key={drive.id} className="flex items-center gap-3 py-2">
                          {drive.images?.[0] && (
                            <div className="w-12 h-12 rounded-lg bg-neutral-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              <img
                                src={getImageUrl(drive.images[0])}
                                alt={drive.name}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          )}
                          <p className="text-sm text-neutral-700 flex-1 truncate">{drive.name}</p>
                          <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">
                            ₹{drive.price?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-neutral-200 flex justify-between items-center">
                  <span className="font-semibold text-neutral-700">Total Price</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                {compatibilityResult && (
                  <div className={`mt-4 p-3 rounded-lg ${compatibilityResult.compatible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm font-medium ${compatibilityResult.compatible ? 'text-green-700' : 'text-red-700'}`}>
                      {compatibilityResult.compatible ? '✓ All components are compatible' : '⚠ Compatibility issues detected'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 p-5 border-t border-neutral-200 bg-neutral-50">
                <button
                  onClick={() => !isGeneratingPDF && !isBuilding && setShowBuildModal(false)}
                  disabled={isGeneratingPDF || isBuilding}
                  className="flex-1 px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-100 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF || isBuilding}
                  className="flex-1 px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-100 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-400/30 border-b-neutral-400 rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiDownload className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={buildPC}
                  disabled={isGeneratingPDF || isBuilding}
                  className="flex-1 px-5 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isBuilding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-b-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-4 h-4" />
                      Confirm & Add to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PCBuilder;