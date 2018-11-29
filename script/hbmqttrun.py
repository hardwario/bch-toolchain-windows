# -*- coding: utf-8 -*-
# See https://github.com/beerfactory/hbmqtt
"""
HBMQTT - MQTT 3.1.1 broker
"""

import logging
import asyncio
import os
import hbmqtt
from hbmqtt.broker import Broker
from hbmqtt.version import get_version

config = {
    'listeners': {
        'default': {
            'type': 'tcp',
            'bind': '127.0.0.1:1883',
            'max_connections': 20,            
        },
        'ws-mqtt': {
            'type': 'ws',
            'bind': '127.0.0.1:8080',
            'max_connections': 10,            
        },
    },
    'sys_interval': 60,
    'auth': {
        'allow-anonymous': True,
        'plugins': ['auth_anonymous'],
    },
}

logger = logging.getLogger(__name__)
formatter = "[%(asctime)s] :: %(levelname)s - %(message)s"
logging.basicConfig(level=logging.INFO, format=formatter)
logger.info("HBMQTT broker version:%s" % get_version())

loop = asyncio.get_event_loop()
broker = Broker(config)
try:
    loop.run_until_complete(broker.start())
    loop.run_forever()
except KeyboardInterrupt:
    loop.run_until_complete(broker.shutdown())
finally:
    loop.close()
