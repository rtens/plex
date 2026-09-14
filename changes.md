# plex Changes

## Current


## Planned

#### [refactor] Byte array identifiers

#### [feature] Pack and Unpack
- Type 0 (Small Packet)
  - 1b 0x00
  - 1b content size (byte)
  - 0-255b content
- Type 1 (Single Packet)
  - 1b 0x01
  - 16b identifier
  - 2b content size (big endian)
  - 0-1400b content
- Type 2 (Start of Chain)
  - 1b 0x02
  - 16b identifier
  - -- rest like Type 1
- Type 3 (Chain)
  - 1b 0x03
  - -- rest like Type 2

#### [feature] UDP Node
- [Server and client](https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb)

#### [feature] CLI Emitter

#### [feature] CLI Detector


## Ideas

#### Limit Packet buffer

#### Limit stored Packet identifiers

#### Time-out abandoned Signals

#### Detach broken links

#### Discover Nodes
- Using network broadcast


## Completed

### Version 0.1

#### [refactor] Signal Chains
- Signals are chained instead of sequenced

#### [feature] Broadcast Signals
- Cell emits and detects Signal
- Node forwards Signals to other Links
- Node distributes Signals to Cells