defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      initState = Memory.GameBackup.load(name)
      if initState do
        game = initState["game"]
        state = initState["state"]
        socket = socket
        |> assign(:game, game)
        |> assign(:join, name)
        {:ok, %{"join" => name, "game" => state}, socket}
      else
        game = Game.new()
        socket = socket
        |> assign(:game, game)
        |> assign(:join, name)
        {:ok, %{"join" => name, "game" => Game.init()}, socket}
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("click", payload, socket) do
    comp = payload["comp"]
    clicks = payload["clicks"]
    displayLetter = payload["displayLetter"]
    disabled = payload["disabled"]
    name = socket.assigns[:join]
    cond do
      comp == 0 ->
        tile = payload["tile"]
        game = Game.display_one(socket.assigns[:game], disabled, displayLetter, tile, clicks)
        stateSave = %{
          "game" => socket.assigns[:game],
          "state" => game
                      }
        Memory.GameBackup.save(stateSave, name)
        {:reply, {:ok, %{"game" => game}}, socket}
      true ->
        one = payload["one"]
        two = payload["two"]
        comp = socket.assigns[:game]
        |> Game.display_one(disabled, displayLetter, two, clicks)
        |> Game.compare(socket.assigns[:game], displayLetter, disabled, one, two)
        if Map.has_key?(comp, :hide) do
          hide = comp[:hide]
          |> Map.put(:disabled, disabled)
          |> Map.put(:clicks, comp[:game][:clicks])
          stateSave = %{
            "game" => socket.assigns[:game],
            "state" => hide
                        }
          Memory.GameBackup.save(stateSave, name)
          {:reply, {:notok, %{"game" => comp[:game], "hide" => comp[:hide]}}, socket}
        else
          stateSave = %{
            "game" => socket.assigns[:game],
            "state" => comp[:game]
                        }
          Memory.GameBackup.save(stateSave, name)
          {:reply, {:ok, %{"game" => comp[:game]}}, socket}
        end
    end
  end

  def handle_in("reset", _, socket) do
    game = Game.new()
    name = socket.assigns[:join]
    socket = socket
    |> assign(:game, game)
    stateSave = %{
      "game" => socket.assigns[:game],
      "state" => game
    }
    Memory.GameBackup.save(stateSave, name)
    {:reply, {:ok, %{"game" => Game.init}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
