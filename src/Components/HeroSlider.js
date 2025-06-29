import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const slides = [
  {
    title: "Build Your Dream Gaming Rig",
    subtitle: "Customize every component for peak performance",
    image: "/hero1.jpg",
    cta: "Start Building",
    color: "#ff6d00",
    overlay: "rgba(0,0,0,0.4)"
  },
  {
    title: "Premium Components",
    subtitle: "Top-tier parts from leading brands",
    image: "/hero2.jpg",
    cta: "Shop Parts",
    color: "#4a148c",
    overlay: "rgba(74,20,140,0.3)"
  },
  {
    title: "Ready-to-Ship Systems",
    subtitle: "Expertly assembled gaming PCs",
    image: "/hero3.jpg",
    cta: "View Prebuilts",
    color: "#00695c",
    overlay: "rgba(0,105,92,0.3)"
  },
  {
    title: "Cutting-Edge GPUs",
    subtitle: "Experience next-gen graphics",
    image: "/hero4.jpg",
    cta: "Explore GPUs",
    color: "#1565c0",
    overlay: "rgba(21,101,192,0.3)"
  },
  {
    title: "High-Speed Memory",
    subtitle: "Boost your system's performance",
    image: "/hero5.jpg",
    cta: "View RAM",
    color: "#6a1b9a",
    overlay: "rgba(106,27,154,0.3)"
  },
  {
    title: "Ultra-Fast Storage",
    subtitle: "NVMe SSDs for instant loading",
    image: "/hero6.jpg",
    cta: "See Storage",
    color: "#e65100",
    overlay: "rgba(230,81,0,0.3)"
  },
  {
    title: "Gaming Peripherals",
    subtitle: "Complete your setup",
    image: "/hero7.jpg",
    cta: "Browse Accessories",
    color: "#c2185b",
    overlay: "rgba(194,24,91,0.3)"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const theme = useTheme();

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      height: { xs: '60vh', md: '80vh' },
      width: '100%',
      overflow: 'hidden',
      mb: 6,
      borderRadius: { xs: 0, md: 4 },
      boxShadow: 6
    }}>
      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: alpha(theme.palette.common.white, 0.2),
          color: 'white',
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.3)
          }
        }}
      >
        <ArrowLeft fontSize="large" />
      </IconButton>
      
      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: alpha(theme.palette.common.white, 0.2),
          color: 'white',
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.3)
          }
        }}
      >
        <ArrowRight fontSize="large" />
      </IconButton>

      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(${slides[currentSlide].overlay}, ${slides[currentSlide].overlay}), url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            color: 'white',
            padding: theme.spacing(4),
            willChange: 'transform'
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.2
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem', lg: '1.8rem' },
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              {slides[currentSlide].subtitle}
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{
                  backgroundColor: slides[currentSlide].color,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  px: 4,
                  py: 1.5,
                  borderRadius: 50,
                  boxShadow: `0 4px 20px ${alpha(slides[currentSlide].color, 0.5)}`,
                  '&:hover': {
                    backgroundColor: alpha(slides[currentSlide].color, 0.9),
                    boxShadow: `0 6px 24px ${alpha(slides[currentSlide].color, 0.7)}`
                  }
                }}
              >
                {slides[currentSlide].cta}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1.5,
        zIndex: 2
      }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            sx={{
              width: currentSlide === index ? 24 : 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: currentSlide === index ? slides[currentSlide].color : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: currentSlide === index ? slides[currentSlide].color : 'rgba(255,255,255,0.7)'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;