#!/bin/bash
#Nitro Sniper enhanced ed.
#Copyright (C) 2020 GiorgioBrux
#
#This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
#This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

if [ -z "$mainToken" ]; then
  printf "Error: mainToken is empty. Quitting..."
  exit 0
elif [ -z "$guildTokens" ]; then
  if [ "$useMain" = "true" ] || [ "$useMain" = true ]; then
    printf "Info: running only on mainToken because guildTokens is empty."
  else
    printf "Error: guildTokens is empty and useMain is set to false/undefined. Set it to true or add slave tokens. Quitting..."
    exit 0
  fi
fi

if [ -z "$useMain" ]; then
  printf "Info: useMain is not set. Defaulting to false..."
  useMain="false"
fi

node .
