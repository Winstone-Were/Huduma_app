import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';

const StyledCard = styled(Card)({
  minWidth: 200,
  padding: 16,
  margin: 8,
  backgroundColor: '#f0f0f0',
});

const TitleTypography = styled(Typography)({
  fontSize: 14,
});

function SummaryCard({ title, value }) {
  return (
    <StyledCard>
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
