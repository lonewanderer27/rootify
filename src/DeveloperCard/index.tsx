import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';

interface social {
  icon: any,
  url: string,
  websiteName: string,
}

export default function DeveloperCard(props: {
  name: string,
  caption: string,
  description: string,
  image: string,
  socials: social[]
}){
  const openLink = (url: string) => {
    window.open(url, '_blank')
  } 

  return (
    <Card sx={{ maxWidth: 350, p: 3, m: 1 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <div style={{
            backgroundImage: `url(${props.image})`,
            height: "80px",
            width: "80px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: "10px"
          }}/>
        </Grid>
        <Grid item xs>
          <div style={{display: "flex", justifyContent: "end"}}>
            {props.socials.map((value) => {
              return (
                <div 
                  title={`Open ${props.name}'s ${value.websiteName} page`}
                  onClick={() => openLink(value.url)} 
                  style={{marginLeft: "5px", cursor: "pointer"}}
                >
                  {value.icon}
                </div>)
            })}
          </div>
        </Grid>
      </Grid>
      <Typography sx={{fontWeight: "bold"}} gutterBottom>
        {props.name}
      </Typography>
      <Typography sx={{color: "#3e5060"}} gutterBottom>
        {props.caption}
      </Typography>
      <hr/>
      <Typography sx={{color: "#3e5060"}} gutterBottom>
        {props.description}
      </Typography>
    </Card>
  )
}