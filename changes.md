# plex Changes

## Current


## Planned

#### [feature] Pack and Unpack
- Type 0 (Single Packet)
  - 1b 0x00
  - 16b identifier (random string)
  - 2b content size (big endian)
  - 0-1400b content
- Type 1 (Chain)
  - 1b 0x01
  - 16b identifier
  - 16b identifier of previous packet (0 if first)
  - 2b content size
  - 0-1400b content
- Type 2 (End of Chain)
  - 1b 0x02
  - -- rest like Type 2

#### [feature] UDP Node
- [Server and client](https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb)

#### [feature] CLI Emitter

#### [feature] CLI Detector


## Ideas

#### Limit Packet buffer
- Either with a ring buffer or time-out

#### Limit deduplication buffer
- Either with a ring buffer or time-out

#### Limit Signal buffer
- Either with a ring buffer or time-out

#### Detach broken Links

#### Ignore Signal
- Data is not transmitted to ignored Signals

#### Discover Nodes
- Using network broadcast


## Completed

### Version 0.1

#### [refactor] Chain with previous Packet

#### [refactor] Signal Chains
- Signals are chained instead of sequenced

#### [feature] Broadcast Signals
- Cell emits and detects Signal
- Node forwards Signals to other Links
- Node distributes Signals to Cells