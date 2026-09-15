# plex Changes

## Current

#### [feature] UDP Link
- [Server and client](https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb)
  

## Planned

#### [feature] Applications
- Node
- Emitter
- Detector


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

#### [feature] Broadcast emitted Signals
- Use pub/sub for Signal

#### [refactor] Chain with previous Packet

#### [refactor] Signal Chains
- Signals are chained instead of sequenced

#### [feature] Broadcast received Signals
- Cell emits and detects Signal
- Node forwards Signals to other Links
- Node distributes Signals to Cells