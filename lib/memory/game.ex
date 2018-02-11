defmodule Memory.Game  do
  def new do
    base = ["A", "B", "C", "D", "E", "F", "G", "H"]
    letterPair = base ++ base
    |> Enum.shuffle
    %{
      letterPair: letterPair,
    }
  end

  def init() do
    displayLetter = List.duplicate("", 16)
    disabled = List.duplicate(0, 16)
    %{
      displayLetter: displayLetter,
      disabled: disabled,
      allow: 1,
      clicks: 0,
      comp: 0,
      check: 0,
      one: -1
    }
  end

  def new_clicks(clicks) do
    clicks + 1
  end

  def hideDisplay(displayLetter, one, two) do
    displayLetter = displayLetter
    |> List.replace_at(one, "")
    |> List.replace_at(two, "")
    %{
      displayLetter: displayLetter,
      one: -1
    }
  end

  def display_one(game, disabled, displayLetter, tile, clicks) do
    letterPair = game.letterPair
    displayLetter = displayLetter
    |> List.replace_at(tile, Enum.at(letterPair, tile))
    %{
      displayLetter: displayLetter,
      disabled: disabled,
      clicks: new_clicks(clicks),
      comp: 1,
      one: tile
    }
  end

  def compare(newState, game, displayLetter, disabled, one, two) do
    letterPair = game.letterPair
    if Enum.at(letterPair, one) == Enum.at(letterPair, two) do
      disabled = disabled
      |> List.replace_at(one, 1)
      |> List.replace_at(two, 1)
      newState = Map.put(newState, :disabled, disabled)
      |> Map.put(:one, -1)
      %{game: newState}
    else
      hideState = hideDisplay(displayLetter, one, two)
      %{game: newState, hide: hideState}
    end
  end

end
