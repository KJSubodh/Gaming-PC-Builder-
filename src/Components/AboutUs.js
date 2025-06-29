import React from "react";
import { Box, Typography, Container, List, ListItem } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h3" gutterBottom color="primary">
        About Us
      </Typography>

      <Typography variant="body1" paragraph>
        Welcome to <strong>BuildyourownPC.ggs</strong>, your one-stop solution for building powerful custom PCs.
        We are passionate tech enthusiasts dedicated to delivering the best hardware at the best price.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Our Mission
      </Typography>
      <Typography variant="body1" paragraph>
        To make high-performance computing accessible and affordable for everyone—from gamers and creators to developers and researchers.
      </Typography>

      <Typography variant="h5" gutterBottom>
        What We Offer
      </Typography>
      <List>
        <ListItem>⚡ Custom PC Builder with real-time pricing</ListItem>
        <ListItem>🖥️ Wide selection of components from top brands</ListItem>
        <ListItem>🔒 Secure checkout and fast delivery</ListItem>
        <ListItem>🧠 Expert support and guides</ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        Meet the Team
      </Typography>
      <Typography variant="body1">
        Our team is made up of software engineers, hardware geeks, and gamers who live and breathe technology.
      </Typography>
    </Container>
  );
};

export default AboutUs;
