// src/components/SummaryCard.js

import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';

const StyledCard = styled(Card)({
  minWidth: 200,
  padding: 16,
  margin: 8,
  backgroundColor: '#f0f0f0',
  cursor: 'pointer', // Adds a pointer cursor to indicate it's clickable
});

const TitleTypography = styled(Typography)({
  fontSize: 14,
});

function SummaryCard({ title, value, onClick }) {
  return (
    <StyledCard onClick={onClick}>
      <CardContent>
        <TitleTypography color="textSecondary" gutterBottom>
          {title}
        </TitleTypography>
        <Typography variant="h5" component="h2">
          {value}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}

export default SummaryCard;
