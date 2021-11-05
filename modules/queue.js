module.exports.initQueue = (opt) => {
  const _player = opt.player
  let _current = null;
  let _history = [];
  let _prevCount = 0;
  let _queue = [];

  const addTracks = (tracks = []) => {
    try {
      if (!tracks.length) throw new Error('Tracks not specified');

      _queue.push(...tracks);

      if (!_current) _current = _queue.shift();

      return _queue;
    } catch (e) {
      throw new Error(e);
    }
  };

  const clearQueue = () => {
    _queue = [];
  };

  const getCurrent = () => {
    return _current;
  };

  const getQueue = () => {
    return _queue;
  };

  const nextTrack = () => {
    if (_queue.length === 0) throw new Error('Queue is empty');

    _prevCount = 0;
    _current = _queue.shift();

    _history.push(_current);

    return _current;
  };

  const prevTrack = () => {
    _current = _history[_prevCount];
    _prevCount++;

    return _current;
  };

  const removeTrack = (index) => {
    try {
      if (index > _queue.length || index < 1) throw new Error('Track number is not valid');

      _queue.splice(index - 1, 1);

      return _queue;
    } catch (e) {
      throw new Error(e);
    }
  };

  return {
    _state: { _current, _history, _prevCount, _queue },
    addTracks,
    clearQueue,
    getCurrent,
    getQueue,
    nextTrack,
    prevTrack,
    removeTrack,
  };
};

module.exports.initQueueManager = (opt) => {
  let _queues = new Map();

  const addGuildQueue = (guildId, queue) => {
    try {
      if (_queues.has(guildId)) return;

      _queues.set(guildId, queue);

      return this;
    } catch (e) {
      throw new Error(e);
    }
  };

  const getGuildQueue = (guildId) => {
    try {
      if (!_queues.has(guildId)) return null;

      return _queues.get(guildId);
    } catch (e) {
      throw new Error(e);
    }
  };

  const deleteGuildQueue = (guildId) => {
    try {
      if (!_queues.has(guildId)) throw new Error('Guild queue does not exist');

      _queues.delete(guildId);

      return this;
    } catch (e) {
      throw new Error(e);
    }
  };

  return { _state: { _queues }, addGuildQueue, deleteGuildQueue, getGuildQueue };
};
