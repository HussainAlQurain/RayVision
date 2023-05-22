from steam.client import SteamClient
from dota2.client import Dota2Client
import dotenv
import os

dotenv.load_dotenv()

client = SteamClient()
dota = Dota2Client(client)

@client.on('logged_on')
def start_dota():
    dota.launch()

@dota.on('ready')
def dota_ready():
    jobid = dota.request_profile(158002007)
    profile_card = dota.wait_msg(jobid, timeout=5)
    
    print(profile_card)

client.cli_login(username=os.environ['DOTA_ACCOUNT'], password=os.environ['DOTA_PASSWORD'])
client.run_forever()